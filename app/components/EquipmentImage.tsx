type Props = {
  imageUrl?: string | null;
  name: string;
};

const STORAGE_URL =
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/equipment-images/`;

export default function EquipmentImage({
  imageUrl,
  name,
}: Props) {
  if (!imageUrl) {
    return (
      <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-500">
        No Image
      </div>
    );
  }

  const src = imageUrl.startsWith("http")
    ? imageUrl
    : STORAGE_URL + imageUrl;

  return (
    <img
      src={src}
      alt={name}
      className="w-14 h-14 rounded-lg object-cover border"
      onError={(e) => {
        e.currentTarget.src = "/no-image.png";
      }}
    />
  );
}