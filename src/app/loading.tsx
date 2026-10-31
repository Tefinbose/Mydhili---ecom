import LoadingScreen from "@/components/common/LoadingScreen";

export default function RootLoading() {
  return (
    <LoadingScreen
      fullScreen
      theme="royal-maroon"
      duration={1600}
      message="Curating timeless elegance"
    />
  );
}

