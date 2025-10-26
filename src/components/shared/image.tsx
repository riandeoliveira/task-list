import { createContext, type ReactNode, useContext, useState } from "react";
import {
  LazyLoadImage,
  type LazyLoadImageProps,
} from "react-lazy-load-image-component";
import { cn } from "@/utils/cn";

type ImageContextType = {
  aspectRatio: string;
  height: number;
  isLoaded: boolean;
  width: number;

  setIsLoaded: (loaded: boolean) => void;
};

const ImageContext = createContext<ImageContextType | undefined>(undefined);

const useImage = () => {
  const context = useContext(ImageContext);

  if (!context) {
    throw new Error("useImage must be used within an Image.Root component");
  }

  return context;
};

type ImageAreaProps = LazyLoadImageProps;

const ImageArea = ({ className, ...props }: ImageAreaProps) => {
  const { isLoaded, setIsLoaded, aspectRatio, width, height } = useImage();

  return (
    <div style={{ aspectRatio }}>
      <LazyLoadImage
        width={width}
        height={height}
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "transition-opacity duration-500 object-cover h-full",
          isLoaded ? "opacity-100" : "opacity-0",
          className,
        )}
        {...props}
      />
    </div>
  );
};

type ImageRootProps = {
  children?: ReactNode;
  height: number;
  width: number;
};

const ImageRoot = ({ children, width, height }: ImageRootProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const aspectRatio = `${width} / ${height}`;

  return (
    <ImageContext.Provider
      value={{
        aspectRatio,
        height,
        isLoaded,
        width,

        setIsLoaded,
      }}
    >
      <div className="relative">{children}</div>
    </ImageContext.Provider>
  );
};

type ImageSkeletonProps = {
  className?: string;
};

const ImageSkeleton = ({ className }: ImageSkeletonProps) => {
  const { isLoaded } = useImage();

  if (isLoaded) return null;

  return (
    <div
      className={cn("bg-zinc-800 animate-pulse absolute inset-0", className)}
    />
  );
};

export const Image = {
  Area: ImageArea,
  Root: ImageRoot,
  Skeleton: ImageSkeleton,
};
