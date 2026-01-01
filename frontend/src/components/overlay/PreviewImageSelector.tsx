import { Button } from "@components/ui";
import { useLocalStorage } from "@hooks";
import React, { ChangeEvent } from "react";

function PreviewImageSelector() {
  const [selectedImage, setSelectedImage] = useLocalStorage<string | null>(
    "reactGridPreviewImage",
    null
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
    <div className="react-grid-image-select-wrapper">
      {selectedImage ? (
        <div className="react-grid-image-select-background">
          <Button
            variant="danger"
            className="react-grid-image-select-background-remove"
            onClick={() => setSelectedImage(null)}
          >
            Remove image
          </Button>
          <img src={selectedImage.toString()} alt="Selected" />
        </div>
      ) : (
        <div className="react-grid-image-input-wrapper">
          Preview image:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
      )}
    </div>
  );
}

export default PreviewImageSelector;
