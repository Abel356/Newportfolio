import { HERO_PHOTOS } from "@/data/content";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Photo = ({ photo, delay }) => (
  <Dialog>
    <DialogTrigger asChild>
      <button
        type="button"
        aria-label={`Open photo: ${photo.caption}`}
        className={`group fu relative block w-full cursor-zoom-in overflow-hidden rounded-[20px] border-[5px] border-[#e3d6c3] bg-[#e3d6c3] shadow-[0_24px_50px_-28px_rgba(43,33,25,0.55)] transition-[border-color] duration-500 hover:border-[#a8471f] aspect-[3/4] ${photo.shape}`}
        style={{ animationDelay: `${delay}s` }}
        data-testid={`hero-photo-${photo.id}`}
      >
        <img
          src={photo.src}
          alt={photo.alt}
          className={`h-full w-full rounded-[14px] object-cover ${photo.focus} sepia-[.18] saturate-[.9] transition-[transform,filter] duration-700 ease-out group-hover:scale-110 group-hover:sepia-0 group-hover:saturate-100`}
        />
        <span className="lab absolute inset-x-2 bottom-2 truncate rounded-full bg-[#2b2119]/85 px-3 py-1.5 text-center text-[#efe7da] opacity-0 translate-y-2 transition-[opacity,transform] duration-500 group-hover:opacity-100 group-hover:translate-y-0">
          {photo.caption}
        </span>
      </button>
    </DialogTrigger>
    <DialogContent
      className="w-auto max-w-[92vw] gap-0 rounded-[24px] border-[6px] border-[#e3d6c3] bg-[#efe7da] p-0 text-[#2b2119] sm:rounded-[24px]"
      data-testid={`hero-photo-${photo.id}-lightbox`}
    >
      <img src={photo.src} alt={photo.alt} className="max-h-[78vh] w-auto max-w-full rounded-t-[18px] object-contain" />
      <DialogTitle className="font-dsp px-5 py-4 text-xl font-normal">{photo.caption}</DialogTitle>
      <DialogDescription className="sr-only">{photo.alt}</DialogDescription>
    </DialogContent>
  </Dialog>
);

// Two staggered columns beside the hero text on desktop, a single row of four on small screens.
export const PhotoStack = () => (
  <div className="grid grid-cols-4 gap-3 lg:flex lg:gap-4" data-testid="hero-photos">
    {[HERO_PHOTOS.slice(0, 2), HERO_PHOTOS.slice(2)].map((column, c) => (
      <div
        key={column[0].id}
        className={`contents lg:flex lg:flex-1 lg:flex-col lg:gap-4 ${c === 1 ? "lg:mt-14" : ""}`}
      >
        {column.map((photo, i) => (
          <Photo key={photo.id} photo={photo} delay={0.6 + (c * 2 + i) * 0.12} />
        ))}
      </div>
    ))}
  </div>
);

export default PhotoStack;
