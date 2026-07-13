"use client";

import type { ImgHTMLAttributes } from "react";

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  fill?: boolean;
  priority?: boolean;
  width?: number;
  height?: number;
};

export function Image({ fill, priority: _priority, className = "", style, ...props }: ImageProps) {
  if (fill) {
    return (
      <img
        {...props}
        className={className}
        style={{
          position: "absolute",
          inset: 0,
          height: "100%",
          width: "100%",
          ...style,
        }}
      />
    );
  }

  return <img {...props} className={className} style={style} />;
}
