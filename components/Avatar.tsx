import Image from "next/image";
import { memo } from "react";

interface ImageProps {
  src: string;
}

interface TextProps {
  initials: string;
}

type AvatarProps = ImageProps | TextProps;

function Avatar(props: AvatarProps) {
  let avatarTemplate;

  if ("src" in props) {
    avatarTemplate = (
      <Image
        src={props.src}
        alt="Avatar"
        className="avatar"
        width={40}
        height={40}
        layout="responsive"
      />
    );
  } else {
    avatarTemplate = <span className="initials">{props.initials}</span>;
  }

  return <div className="avatar-container">{avatarTemplate}</div>;
}

export default memo(Avatar);
