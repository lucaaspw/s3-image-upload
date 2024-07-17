'use server'

import { s3Client } from "@/lib/s3client";
import { DeleteObjectCommand, ListObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const BUCKECT_NAME = 'lgdev-photos-upload';
const MAX_IMAGES = 15;

interface UploadResponse {
  success: boolean;
  message?: string;
}

async function validateImage(image: File): Promise<UploadResponse>{
  if(!image.size){
    return{
      success: false,
      message: 'Necessário adicionar um arquivo.'
    }
  }

  if(!image.type.startsWith('image/')){
    return{
      success: false,
      message: 'Formato inválido, necessário ser do tipo imagem.'
    }
  }
  if(image.size > MAX_IMAGE_SIZE){
    return {
      success: false,
      message: 'Arquivo muito grande, maior que 2MB.'
    }
  }
  return { success: true }
}

async function tooManyImages(): Promise<boolean> {
  const listObjectsParams = new ListObjectsCommand({Bucket: BUCKECT_NAME});
  const objects = await s3Client.send(listObjectsParams);
  return (objects.Contents?.length ?? 0) > MAX_IMAGES;
}

async function uploadToS3(image: File): Promise<void>{
  const arrayBuffer = await image.arrayBuffer();
  const imageBuffer = Buffer.from(arrayBuffer);

  const putObjectParams = new PutObjectCommand({
    Bucket: BUCKECT_NAME,
    Key: image.name,
    Body: imageBuffer,
    ContentType: image.type
  });

  await s3Client.send(putObjectParams);
}

export async function uploadImageUppy(formData: FormData): Promise<UploadResponse> {
  const images: File[] = formData.getAll('images') as File[];

  for (const image of images) {
    const validationResponse = await validateImage(image);
    if (!validationResponse.success) {
      return validationResponse;
    }
  }

  if (await tooManyImages()) {
    return {
      success: false,
      message: "Sua aplicação atingiu o número máximo de imagens. Delete alguma para proceguir."
    };
  }

  try {
    await Promise.all(images.map(uploadToS3));
    revalidatePath('/');
    return { success: true };
  } catch (e) {
    console.error("Erro ao fazer upload das imagens:", e);
    return {
      success: false,
      message: 'Algo deu errado :/'
    };
  }
}

export async function deleteImage(key: string): Promise<UploadResponse> {
  const deleteObjectParams = new DeleteObjectCommand({
    Bucket: BUCKECT_NAME,
    Key: key
  });

  try {
    await s3Client.send(deleteObjectParams);
    revalidatePath("/");
    return {success: true}
  } catch(e){
    console.error("Erro ao deletar a imagem: ", e);
    return{
      success: false,
      message: "Erro ao deletar a imagem"
    }
  }
}