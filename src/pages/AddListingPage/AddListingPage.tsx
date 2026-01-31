import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Upload, X } from "lucide-react";
import { ROUTES } from "@/constants/routes";

const addListingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  condition: z.string().min(1, "Please select a condition"),
  price: z.string().min(1, "Price is required"),
  location: z.string().min(1, "Location is required"),
});

type AddListingFormData = z.infer<typeof addListingSchema>;

export default function AddListingPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddListingFormData>({
    resolver: zodResolver(addListingSchema),
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages([...images, ...files].slice(0, 5)); // Max 5 images
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: AddListingFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement add listing API call with images
      console.log("Add listing:", data, images);
      navigate(ROUTES.MY_LISTINGS);
    } catch (error) {
      console.error("Add listing error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout title="Add New Listing" maxWidth="4xl">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Plus className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-h2 font-semibold">Create New Listing</h1>
            <p className="text-body text-muted-foreground">
              Add a product to the marketplace
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Images Upload */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-h4 font-semibold">Product Images</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Upload ${index + 1}`}
                    className="h-full w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-error text-error-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-20 transition-colors hover:bg-neutral-5">
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <span className="text-caption text-muted-foreground">
                    Upload
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="mt-2 text-caption text-muted-foreground">
              Upload up to 5 images. First image will be the cover.
            </p>
          </div>

          {/* Basic Information */}
          <div className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
            <h3 className="text-h4 font-semibold">Basic Information</h3>

            <Input
              label="Title"
              placeholder="e.g., iPhone 13 Pro Max 256GB"
              {...register("title")}
              error={errors.title?.message}
            />

            <div>
              <label className="text-bodySmall mb-2 block font-medium">
                Description
              </label>
              <textarea
                {...register("description")}
                placeholder="Describe your product in detail..."
                className="min-h-[120px] w-full rounded-md border border-neutral-20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.description && (
                <p className="mt-1 text-caption text-error">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-bodySmall mb-2 block font-medium">
                  Category
                </label>
                <select
                  {...register("category")}
                  className="w-full rounded-md border border-neutral-20 px-3 py-2"
                >
                  <option value="">Select category</option>
                  <option value="phones">Phones</option>
                  <option value="laptops">Laptops</option>
                  <option value="tablets">Tablets</option>
                  <option value="accessories">Accessories</option>
                  <option value="audio">Audio</option>
                  <option value="cameras">Cameras</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-caption text-error">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-bodySmall mb-2 block font-medium">
                  Condition
                </label>
                <select
                  {...register("condition")}
                  className="w-full rounded-md border border-neutral-20 px-3 py-2"
                >
                  <option value="">Select condition</option>
                  <option value="new">New</option>
                  <option value="like-new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
                {errors.condition && (
                  <p className="mt-1 text-caption text-error">
                    {errors.condition.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Price"
                type="number"
                placeholder="0.00"
                {...register("price")}
                error={errors.price?.message}
              />

              <Input
                label="Location"
                placeholder="City, State"
                {...register("location")}
                error={errors.location?.message}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              intent="outline"
              onClick={() => navigate(ROUTES.MY_LISTINGS)}
            >
              Cancel
            </Button>
            <Button type="submit" intent="primary" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Listing"}
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
