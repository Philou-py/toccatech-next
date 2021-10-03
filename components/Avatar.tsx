import { ReactNode } from "react";

interface AvatarProps {
  children: ReactNode;
}

export default function Avatar({ src }: AvatarProps) {
  return <div className="avatar"></div>;
}
