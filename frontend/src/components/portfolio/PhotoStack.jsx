import { HERO_PHOTOS } from "@/data/content";

const Photo = ({ photo, delay }) => (
  <figure
    className={`group fu relative overflow-hidden rounded-[20px] border-[5px] border-[#e3d6c3] bg-[#e3d6c3] shadow-[0_24px_50px_-28px_rgba(43,33,25,0.55)] transition-[border-color] duration-500 hover:border-[#a8471f] aspect-[3/4] ${photo.shape}`}
    style={{ animationDelay: `${delay}s` }}
    data-testid={`hero-photo-${photo.id}`}
  >
    <img
      src={photo.src}
      alt={photo.alt}
      className={`h-full w-full rounded-[14px] object-cover ${photo.focus} sepia-[.18] saturate-[.9] transition-[transform,filter] duration-700 ease-out group-hover:scale-110 group-hover:sepia-0 group-hover:saturate-100`}
    />
    <figcaption className="lab absolute inset-x-2 bottom-2 truncate rounded-full bg-[#2b2119]/85 px-3 py-1.5 text-center text-[#efe7da] opacity-0 translate-y-2 transition-[opacity,transform] duration-500 group-hover:opacity-100 group-hover:translate-y-0">
      {photo.caption}
    </figcaption>
  </figure>
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
