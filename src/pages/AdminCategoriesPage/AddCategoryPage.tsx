import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { FullScreenLoading } from "@/components/feedback/loading/full-screen-loading";
import { ROUTES } from "@/constants/routes";
import { useCreateAdminCategory } from "@/services/admin-categories.service";
import {
  AttributeEditorCard,
  CategoryActionSuccessDialog,
  CategoryFormLayout,
  CategoryIconUploader,
  DeleteAttributeDialog,
  createEmptyEditableAttribute,
  isCategoryFormValid,
  toCategoryPayload,
  type EditableCategoryAttribute,
} from "./form";

const cardClassName = "rounded-2xl border border-neutral-10 bg-white p-6";

interface SuccessState {
  title: string;
  description: string;
  navigateToList?: boolean;
}

export default function AddCategoryPage() {
  const navigate = useNavigate();
  const createCategoryMutation = useCreateAdminCategory();
  const timerRef = useRef<number | null>(null);

  const [categoryName, setCategoryName] = useState("");
  const [categoryStatus, setCategoryStatus] = useState(false);
  const [iconUrl, setIconUrl] = useState<string | undefined>(undefined);
  const [attributes, setAttributes] = useState<EditableCategoryAttribute[]>([
    createEmptyEditableAttribute(),
  ]);
  const [attributeToDeleteIndex, setAttributeToDeleteIndex] = useState<
    number | null
  >(null);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [successState, setSuccessState] = useState<SuccessState | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      if (iconUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(iconUrl);
      }
    };
  }, [iconUrl]);

  const runWithLoader = (action: () => Promise<void> | void) => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    setLoadingOpen(true);
    timerRef.current = window.setTimeout(async () => {
      try {
        await action();
      } finally {
        setLoadingOpen(false);
      }
    }, 800);
  };

  const handleDeleteAttributeConfirm = () => {
    if (attributeToDeleteIndex === null) return;

    const targetIndex = attributeToDeleteIndex;
    setAttributeToDeleteIndex(null);

    runWithLoader(() => {
      setAttributes((prev) => prev.filter((_, index) => index !== targetIndex));
      setSuccessState({
        title: "Attribute Deleted Successfully",
        description:
          "The selected attribute has been removed from this category.",
      });
    });
  };

  const handleSubmit = () => {
    if (!isCategoryFormValid(categoryName, attributes)) return;

    const payload = toCategoryPayload(
      categoryName,
      iconUrl,
      categoryStatus,
      attributes,
    );

    runWithLoader(async () => {
      await createCategoryMutation.mutateAsync(payload);
      setSuccessState({
        title: "Category Added Successfully",
        description: "The new category has been saved and is ready to use.",
        navigateToList: true,
      });
    });
  };

  const isSubmitDisabled =
    !isCategoryFormValid(categoryName, attributes) ||
    createCategoryMutation.isPending;

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
        title="Add Category"
        submitLabel="Add Category"
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

      <FullScreenLoading open={loadingOpen} message="Saving category..." />
    </>
  );
}
