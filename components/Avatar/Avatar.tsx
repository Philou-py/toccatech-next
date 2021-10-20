import css from "./Avatar.module.scss";
import Image from "next/image";
import { CSSProperties, memo, useMemo } from "react";
import cn from "classnames";

interface CommonAvatarProps {
  borderColour?: string;
  size?: number;
}

interface ImageProps extends CommonAvatarProps {
  type: "image-avatar";
  src: string;
}

interface TextProps extends CommonAvatarProps {
  type: "initials-avatar";
  initials: string;
  bgColour?: string;
}

type AvatarProps = ImageProps | TextProps;

function Avatar(props: AvatarProps) {
  let avatarTemplate;
  let style: CSSProperties & {
    "--border-colour"?: string;
    "--avatar-bg"?: string;
    "--size"?: string;
  } = {};
  if (props.borderColour) style["--border-colour"] = props.borderColour;
  style["--size"] = props.size ? props.size + "px" : "50px";

  const initialsAvatarBgColour = useMemo(() => {
    if (!("src" in props)) {
      if (props.bgColour) {
        return props.bgColour;
      } else {
        return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
      }
    }
  }, [props]);

  if ("src" in props) {
    avatarTemplate = (
      <Image
        src={props.src}
        alt="Avatar"
        className={cn(css.avatar, { [css["border-around"]]: props.borderColour })}
        width={40}
        height={40}
        layout="responsive"
      />
    );
  } else {
    style["--avatar-bg"] = initialsAvatarBgColour;
    avatarTemplate = <div className={css.initials}>{props.initials}</div>;
  }

  return (
    <div className={css["avatar-container"]} style={style}>
      {avatarTemplate}
    </div>
  );
}

export default memo(Avatar);
