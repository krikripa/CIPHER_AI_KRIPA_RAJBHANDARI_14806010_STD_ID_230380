import EncodeDecodeControls from "../workspace/EncodeDecodeControls";
import UserMenu from "../user/UserMenu";

export default function TopBar() {
  return (
    <header className="h-14 flex items-center justify-between px-4 border-b dark:border-gray-700">
      <h1 className="font-bold text-lg">Cipher AI</h1>

      <EncodeDecodeControls />

      <UserMenu />
    </header>
  );
}
