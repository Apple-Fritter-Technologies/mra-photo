"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

import {
  fetchCarouselImages,
  reorderCarouselImages,
} from "@/lib/actions/carousel-actions";
import { CarouselImage } from "@/types/intrerface";
import { Loader2, GripVertical, Pencil, Plus } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import CarouselModal from "../../components/carousel-modal";

const CarouselPage = () => {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentImage, setCurrentImage] = useState<CarouselImage | null>(null);

  const getCarouselImages = async () => {
    setLoading(true);
    try {
      const res = await fetchCarouselImages();

      if (res.error) {
        setError(true);
        toast.error(res.error);
      } else {
        setImages(res);
      }
    } catch (error: unknown) {
      setError(true);
      toast.error("Failed to fetch carousel images");
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setImages(items);

    // Get all IDs in the new order
    const orderedIds = items.map((item) => item.id);

    // Send the new order to the server
    const res = await reorderCarouselImages(orderedIds);
    if (res.error) {
      toast.error(res.error);
      // Revert to original order by refetching
      getCarouselImages();
    } else {
      toast.success("Carousel images reordered successfully");
    }
  };

  useEffect(() => {
    getCarouselImages();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 space-y-4">
      <div className="flex justify-between items-center sticky top-2 z-10 backdrop-blur-xl bg-background/50 rounded-lg border border-white/10 p-4">
        <h1 className="text-2xl font-bold">Carousel Management</h1>

        <Button
          onClick={() => {
            setOpen(true);
            setIsEditing(false);
            setCurrentImage(null);
          }}
        >
          <Plus size={16} className="mr-2" />
          Add Image
        </Button>

        <CarouselModal
          open={open}
          setOpen={setOpen}
          imageData={currentImage || { id: "", image_url: "", title: "" }}
          getCarouselImages={getCarouselImages}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      </div>

      {error && (
        <div className="text-red-500 text-center py-4 bg-muted/50 rounded-lg">
          <p>Error fetching carousel images. Please try again.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setError(false);
              getCarouselImages();
            }}
          >
            Retry
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && !error && images.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <h3 className="text-lg font-medium">No carousel images yet</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Add images to showcase in your homepage carousel
          </p>
          <Button
            className="mt-4"
            onClick={() => {
              setOpen(true);
              setIsEditing(false);
              setCurrentImage(null);
            }}
          >
            Add Image
          </Button>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="carousel-images">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {images.map((image, index) => (
                  <Draggable
                    key={image.id}
                    draggableId={image.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="group relative overflow-hidden rounded-lg border shadow-sm transition-all bg-card"
                      >
                        <div className="flex items-center p-3">
                          <div
                            {...provided.dragHandleProps}
                            className="mr-3 cursor-move text-muted-foreground hover:text-foreground"
                          >
                            <GripVertical size={20} />
                          </div>

                          <div className="flex-1 flex items-center gap-4">
                            <div className="h-20 w-32 relative rounded overflow-hidden">
                              <Image
                                src={image.image_url}
                                alt={image.title || "Carousel image"}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">
                                {image.title || "Untitled"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Order: {image.displayOrder}
                              </p>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            variant="ghost"
                            className="ml-2"
                            onClick={() => {
                              setIsEditing(true);
                              setCurrentImage(image);
                              setOpen(true);
                            }}
                          >
                            <Pencil size={16} />
                          </Button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default CarouselPage;
