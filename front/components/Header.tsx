import { Container } from "@radix-ui/themes";
import Image from "next/image";

export const Header = () => {
  return (
    <header className="flex justify-between items-center p-6 text-white">
      <Container>
        <Image
          src="/img/logo.png"
          width={126}
          height={113}
          alt="king of towers"
        />
      </Container>
    </header>
  );
};
