import { Variants, motion } from "framer-motion";
import { GalverseLogo, TokenboundLogo } from "@/components/icon";
import { Panel } from "./Panel";
import { TbaOwnedNft } from "@/lib/types";
import Image from "next/image";

interface Props {
  className?: string;
  isOpen: boolean;
  handleOpenClose: (arg0: boolean) => void;
  approvalTokensCount?: number;
  account?: string;
  tokens: TbaOwnedNft[];
  title: string;
  chainId: number;
  logo?: string;
}

const variants = {
  closed: { y: "100%", transition: { duration: 0.75 } },
  open: { y: "0", transition: { duration: 0.75 }, height: "85%" },
} as Variants;

const iconVariant = {
  hover: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  unHovered: {
    opacity: 0.7,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

type LogoType = {
  [logo: string]: any;
};

const Logo: LogoType = {
  DEFAULT: TokenboundLogo,
  GALVERSE: GalverseLogo,
};

export const TokenDetail = ({
  className,
  isOpen,
  handleOpenClose,
  approvalTokensCount,
  account,
  tokens,
  title,
  chainId,
  logo,
}: Props) => {
  let currentAnimate = isOpen ? "open" : "closed";

  const CustomLogo = logo ? Logo[logo.toUpperCase()] : Logo["DEFAULT"];

  return (
    <div className={className}>
      {isOpen ? (
        <Image
          src="/close.svg"
          alt="close-icon"
          width={54}
          height={54}
          onClick={() => handleOpenClose(false)}
          className="absolute left-4 top-4 z-10 p-2 rounded-full bg-black/60 cursor-pointer hover:bg-black transition-all duration-200"
        />
      ) : (
        <motion.div
          className="absolute left-4 top-4 z-10 p-3 rounded-full bg-white/40 cursor-pointer"
          whileHover="hover"
          variants={iconVariant}
          initial="unHovered"
        >
          <CustomLogo onClick={() => handleOpenClose(true)} />
        </motion.div>
      )}

      {isOpen && (
        <motion.div
          className={`custom-scroll absolute bottom-0 z-10 w-full max-w-[1080px] overflow-y-auto`}
          animate={currentAnimate}
          variants={variants}
          initial="closed"
        >
          <Panel
            approvalTokensCount={approvalTokensCount}
            account={account}
            tokens={tokens}
            title={title}
            chainId={chainId}
          />
        </motion.div>
      )}
    </div>
  );
};
