'use client'

import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import pt_BR from '@uppy/locales/lib/pt_BR';
import { uploadImageUppy } from "../_actions/actions";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import '@uppy/drag-drop/dist/style.min.css';
import './uppy-styles.css';

type Meta = Record<string, any>;
type Body = Record<string, any>;

export default function UppyUpload() {
  const [uppy, setUppy] = useState<Uppy<Meta, Body> | null>(null)
  useEffect(() =>{
    const uppyInstance = new Uppy<Meta, Body>({locale: pt_BR }).on('complete', async (result) => {
      const files = result.successful;
      const formData = new FormData();
      files?.forEach((file) => {
        formData.append('images', file.data);
      });
      uploadImageUppy(formData).then((actionRes) => {
        if(actionRes?.success){
          uppy?.cancelAll();
          toast({
            description: 'Envio de imagem concluído!'
          })
        }else{
          toast({
            variant: "destructive",
            description: 'Ops...' + actionRes.message
          })
        }
      });
    });
    setUppy(uppyInstance);
  }, [])
  return(
    <div className="px-10 lg:px-0 z-10">
      {uppy && <Dashboard width={'100%'} height={200} uppy={uppy} />}
    </div>
  )
}