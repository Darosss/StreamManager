import { Button } from "@components/ui/button";
import { useLocalStorage } from "@hooks";
import { ChangeEvent } from "react";
import { createPortal } from "react-dom";

function PreviewImageSelector() {
  const [selectedImage, setSelectedImage] = useLocalStorage<string | null>(
    "reactGridPreviewImage",
    null,
  );

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === "string") setSelectedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {selectedImage &&
        createPortal(
          <img
            src={selectedImage.toString()}
            className="react-grid-image--background"
            alt="Selected"
          />,
          document.getElementById("root")!,
        )}

      <div className="react-grid-image-select-wrapper">
        {selectedImage ? (
          <Button
            variant="danger"
            className="react-grid-image-select-background-remove"
            onClick={() => setSelectedImage(null)}
          >
            Remove image
          </Button>
        ) : (
          <div className="react-grid-image-input-wrapper">
            Preview image:
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
        )}
      </div>
    </>
  );
}

export default PreviewImageSelector;
