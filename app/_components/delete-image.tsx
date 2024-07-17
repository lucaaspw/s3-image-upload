'use client'

import { FC, FormEvent } from "react";
import { deleteImage } from "../_actions/actions";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";


interface DeleteImageProps {
  imageKey: string;
}

const DeleteImage: FC<DeleteImageProps> = ({ imageKey }) => {
  const handleDeleteImage = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const actionRes = await deleteImage(imageKey);

      if (actionRes?.success) {
        toast({
          description: "Imagem apagada com sucesso",
        });
        document.getElementById('closeDialogButton')?.click(); // Fechar o modal
      } else {
        toast({
          variant: "destructive",
          description: "Ops... ocorreu um erro",
        });
      }
    } catch (error) {
      console.error("Erro ao deletar a imagem:", error);
      toast({
        variant: "destructive",
        description: "Ops... ocorreu um erro inesperado",
      });
    }
  };

  return (
    <form onSubmit={handleDeleteImage}>
      <Button variant="destructive" type="submit">
        Confirmar
      </Button>
      <DialogClose asChild>
        <button id="closeDialogButton" style={{ display: 'none' }}>Fechar</button>
      </DialogClose>
    </form>
  );
};

export default DeleteImage;