import ImageGallery from "./_components/image-gallery";
import UppyUpload from "./_components/uppy-upload";

export default function Home() {
  return (
    <div className="relative">
      <header className="flex justify-center pt-16">
        <div className="flex flex-col items-center border-b-[1px] border-b-slate-300 px-2 lg:px-20 pb-4">
          <h1 className="text-3xl lg:text-4xl text-center text-[#375184] font-bold mb-3">Galeria de fotos com <strong>Next.js e S3 AWS</strong></h1>
        </div>
      </header>
      <div className="max-w-[900px] flex-1 mt-12 mx-auto mb-12">
        <UppyUpload/>
        <div className="mt-9">
          <h3 className="text-center text-2xl md:text-3xl font-bold text-[#375184]">Galeria de fotos de Gatos</h3>
          <ImageGallery/>
        </div>
      </div>
      <footer className="bg-[#375184] h-[55px] flex justify-center items-center">
        <p className="text-center text-white">&copy; Desenvolvido por LK Dev</p>
      </footer>
    </div>
  );
}
