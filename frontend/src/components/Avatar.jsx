import React from "react";

const Avatar = ({ src, size = 150, className = "" }) => {
  const DEFAULT_AVATAR = "/images/default-avatar.png";
  const FALLBACK_AVATAR =
    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

  const [imgSrc, setImgSrc] = React.useState(src || DEFAULT_AVATAR);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setImgSrc(src || DEFAULT_AVATAR);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    console.log("Avatar load error:", {
      attempted: imgSrc,
      willTry: !hasError ? DEFAULT_AVATAR : FALLBACK_AVATAR,
    });

    if (!hasError) {
      setImgSrc(DEFAULT_AVATAR);
      setHasError(true);
    } else {
      setImgSrc(FALLBACK_AVATAR);
    }
  };

  return (
    <img
      src={imgSrc}
      alt="Avatar"
      onError={handleError}
      className={`avatar ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: "cover",
        borderRadius: "50%",
        border: "2px solid #ddd",
      }}
    />
  );
};

export default Avatar;
