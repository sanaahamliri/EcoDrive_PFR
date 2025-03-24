import React from "react";

const Avatar = ({ src, size = 150, className = "" }) => {
  // Utilisation d'une URL d'avatar par défaut plus fiable
  const FALLBACK_AVATAR =
    "https://ui-avatars.com/api/?background=0D8ABC&color=fff";

  const getImageSrc = (src) => {
    if (!src) return FALLBACK_AVATAR;

    // Si src est un objet avec une propriété avatar contenant des données base64
    if (src.avatar?.data) {
      return `data:image/jpeg;base64,${src.avatar.data}`;
    }

    // Si src est directement un objet avec des données base64
    if (src.data) {
      return `data:image/jpeg;base64,${src.data}`;
    }

    // Si src est une URL
    if (typeof src === "string") {
      if (src.startsWith("data:")) return src;
      if (src.startsWith("http")) return src;
      return FALLBACK_AVATAR;
    }

    return FALLBACK_AVATAR;
  };

  const [imgSrc, setImgSrc] = React.useState(getImageSrc(src));
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setImgSrc(getImageSrc(src));
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      console.error("Failed to load avatar:", src);
      setImgSrc(FALLBACK_AVATAR);
      setHasError(true);
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
