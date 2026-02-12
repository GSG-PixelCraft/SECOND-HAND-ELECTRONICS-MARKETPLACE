import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { FullScreenLoading } from "@/components/feedback/loading/full-screen-loading";
import { ROUTES } from "@/constants/routes";
import {
  useAdminCategoryDetail,
  useDeleteAdminCategoryAttribute,
  useUpdateAdminCategory,
} from "@/services/admin-categories.service";
import {
  AttributeEditorCard,
  CategoryActionSuccessDialog,
  CategoryFormLayout,
  CategoryIconUploader,
  DeleteAttributeDialog,
  createEmptyEditableAttribute,
  isCategoryFormValid,
  isTemporaryAttribute,
  toCategoryPayload,
  toEditableAttributes,
  type EditableCategoryAttribute,
} from "./form";

const cardClassName = "rounded-2xl border border-neutral-10 bg-white p-6";

interface SuccessState {
  title: string;
  description: string;
  navigateToList?: boolean;
}

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const updateCategoryMutation = useUpdateAdminCategory();
  const deleteAttributeMutation = useDeleteAdminCategoryAttribute();
  const { data, isLoading, error } = useAdminCategoryDetail(id);

  const [categoryName, setCategoryName] = useState("");
  const [categoryStatus, setCategoryStatus] = useState(false);
  const [iconUrl, setIconUrl] = useState<string | undefined>(undefined);
  const [attributes, setAttributes] = useState<EditableCategoryAttribute[]>([]);
  const [attributeToDeleteIndex, setAttributeToDeleteIndex] = useState<
    number | null
  >(null);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [successState, setSuccessState] = useState<SuccessState | null>(null);

  useEffect(() => {
    if (!data) return;
    setCategoryName(data.name);
    setCategoryStatus(data.categoryStatus);
    setIconUrl(data.iconUrl);
    setAttributes(toEditableAttributes(data.attributes));
  }, [data]);

  useEffect(() => {
    return () => {
      if (iconUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(iconUrl);
      }
    };
  }, [iconUrl]);

  const runWithLoader = async (action: () => Promise<void> | void) => {
    setLoadingOpen(true);
    try {
      await action();
    } finally {
      setLoadingOpen(false);
    }
  };

  const handleDeleteAttributeConfirm = () => {
    if (attributeToDeleteIndex === null) return;

    const targetIndex = attributeToDeleteIndex;
    const targetAttribute = attributes[targetIndex];
    if (!targetAttribute) return;

    setAttributeToDeleteIndex(null);

    void runWithLoader(async () => {
      if (!isTemporaryAttribute(targetAttribute.id) && id) {
        await deleteAttributeMutation.mutateAsync({
          categoryId: id,
          attributeId: targetAttribute.id,
        });
      }

      setAttributes((prev) => prev.filter((_, index) => index !== targetIndex));

      setSuccessState({
        title: "Attribute Deleted Successfully",
        description:
          "The selected attribute has been removed from this category.",
      });
    });
  };

  const handleSubmit = () => {
    if (!id || !isCategoryFormValid(categoryName, attributes)) return;

    const payload = toCategoryPayload(
      categoryName,
      iconUrl,
      categoryStatus,
      attributes,
    );

    void runWithLoader(async () => {
      await updateCategoryMutation.mutateAsync({ id, payload });
      setSuccessState({
        title: "Category Updated Successfully",
        description: "Your category changes were saved and are now live.",
        navigateToList: true,
      });
    });
  };

  if (!id) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-6">
        <div className="rounded-xl border border-error/10 bg-error/5 p-8 text-center">
          <Text variant="bodyLg" className="font-semibold text-error">
            Invalid category link
          </Text>
          <Text variant="caption" className="mt-2 block text-error/70">
            Missing category identifier.
          </Text>
          <Button
            intent="outline"
            size="sm"
            className="mt-6"
            onClick={() => navigate(ROUTES.ADMIN_CATEGORIES)}
          >
            Back to Categories
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <FullScreenLoading message="Loading category details..." />;
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-6">
        <div className="rounded-xl border border-error/10 bg-error/5 p-8 text-center">
          <Text variant="bodyLg" className="font-semibold text-error">
            Category not found
          </Text>
          <Text variant="caption" className="mt-2 block text-error/70">
            This category no longer exists or was removed.
          </Text>
          <Button
            intent="outline"
            size="sm"
            className="mt-6"
            onClick={() => navigate(ROUTES.ADMIN_CATEGORIES)}
          >
            Back to Categories
          </Button>
        </div>
      </div>
    );
  }

  const isSubmitDisabled =
    !isCategoryFormValid(categoryName, attributes) ||
    updateCategoryMutation.isPending;

  const leftPanel = (
    <div className={cardClassName}>
      <h2 className="text-neutral-90 text-[18px] font-semibold">
        Basic Information
      </h2>
      <div className="mt-5 space-y-6">
        <div className="space-y-2">
          <label className="text-neutral-80 text-base font-medium">
            Category Name
          </label>
          <input
            value={categoryName}
            onChange={(event) => setCategoryName(event.target.value)}
            placeholder="Enter category name"
            className="text-neutral-90 placeholder:text-neutral-40 h-12 w-full rounded-xl border border-neutral-20 px-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-neutral-80 text-base font-medium">Icon</label>
          <CategoryIconUploader
            iconUrl={iconUrl}
            onSelect={(_, previewUrl) => {
              if (iconUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(iconUrl);
              }
              setIconUrl(previewUrl);
            }}
            onRemove={() => {
              if (iconUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(iconUrl);
              }
              setIconUrl(undefined);
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-neutral-80 text-base font-medium">
            Category Status
          </span>
          <Switch
            checked={categoryStatus}
            onCheckedChange={setCategoryStatus}
          />
        </div>
      </div>
    </div>
  );

  const rightPanel = (
    <div className={cardClassName}>
      <div className="flex items-center justify-between">
        <h2 className="text-neutral-90 text-[18px] font-semibold">
          Attributes Builder
        </h2>
        <Button
          intent="outline"
          onClick={() =>
            setAttributes((prev) => [...prev, createEmptyEditableAttribute()])
          }
          className="h-10 rounded-xl border-primary px-5 text-base font-medium text-primary hover:bg-primary/5"
        >
          Add Attribute
        </Button>
      </div>

      <div className="mt-5 space-y-4">
        {attributes.map((attribute, index) => (
          <AttributeEditorCard
            key={attribute.id}
            attribute={attribute}
            onChange={(nextAttribute) =>
              setAttributes((prev) =>
                prev.map((item, itemIndex) =>
                  itemIndex === index ? nextAttribute : item,
                ),
              )
            }
            onDelete={() => setAttributeToDeleteIndex(index)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          setAttributes((prev) => [...prev, createEmptyEditableAttribute()])
        }
        className="text-neutral-50 mt-6 flex h-[74px] w-full items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-20 text-lg font-medium transition-colors hover:bg-neutral-5"
      >
        <Plus className="h-5 w-5" />
        Add Another Attribute
      </button>
    </div>
  );

  return (
    <>
      <CategoryFormLayout
        title="Edit Category"
        submitLabel="Edit Category"
        submitDisabled={isSubmitDisabled}
        onBack={() => navigate(ROUTES.ADMIN_CATEGORIES)}
        onSubmit={handleSubmit}
        leftPanel={leftPanel}
        rightPanel={rightPanel}
      />

      <DeleteAttributeDialog
        open={attributeToDeleteIndex !== null}
        onClose={() => setAttributeToDeleteIndex(null)}
        onConfirm={handleDeleteAttributeConfirm}
      />

      <CategoryActionSuccessDialog
        open={Boolean(successState)}
        title={successState?.title || ""}
        description={successState?.description || ""}
        onDone={() => {
          const shouldNavigate = Boolean(successState?.navigateToList);
          setSuccessState(null);
          if (shouldNavigate) {
            navigate(ROUTES.ADMIN_CATEGORIES);
          }
        }}
      />

      <FullScreenLoading
        open={loadingOpen}
        message="Saving category changes..."
      />
    </>
  );
}
