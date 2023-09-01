/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";
import { useState } from "react";
import { Check, Exclamation, GalverseLogo } from "@/components/icon";
import { Tabs, TabPanel, MediaViewer, ExternalLink } from "@/components/ui";
import { TbaOwnedNft } from "@/lib/types";
import useSWR from "swr";
import { getAlchemy } from "@/lib/clients";
import { ethers } from "ethers";
import { useGetTokenBalances } from "@/lib/hooks";
import { getEtherscanLink, shortenAddress } from "@/lib/utils";
import { chainIdToOpenseaAssetUrl } from "@/lib/constants";
import Image from "next/image";

import galverseLogo from "@/public/no-img.jpg";

export const TABS = {
  COLLECTIBLES: "Collectibles",
  ASSETS: "Assets",
};

interface Props {
  className?: string;
  approvalTokensCount?: number;
  account?: string;
  tokens: TbaOwnedNft[];
  title: string;
  chainId: number;
}

export const Panel = ({
  className,
  approvalTokensCount,
  account,
  tokens,
  title,
  chainId,
}: Props) => {
  const [copied, setCopied] = useState(false);
  const [currentTab, setCurrentTab] = useState(TABS.COLLECTIBLES);

  const displayedAddress = account;

  const { data: ethBalance } = useSWR(account ? account : null, async (accountAddress) => {
    const alchemy = getAlchemy(chainId);
    const balance = await alchemy.core.getBalance(accountAddress, "latest");
    return ethers.utils.formatEther(balance);
  });

  const { data: tokenBalanceData } = useGetTokenBalances(account as `0x${string}`, chainId);
  const etherscanLink = getEtherscanLink({ chainId, address: account });

  return (
    <div
      className={clsx(
        className,
        "custom-scroll relative h-full space-y-3 overflow-y-auto rounded-t-[40px] border-t-0 bg-black-bg text-white px-6 pt-6 bg-[url('/bg-circle.svg'),url('/gridpattern.svg')] bg-cover"
      )}
    >
      <div className=" mb-6 h-[5px] w-[50px] rounded-full bg-white/80 mx-auto" />

      <h1 className="text-lg uppercase text-gray-text/80 font-semibold">{title}</h1>

      <div className="flex items-center justify-between !-mt-1 !mb-4">
        <div className="flex ">
          <Image src="/galverse-logo-white.svg" alt="logo" width={36} height={36} />
          <h2 className="text-5xl uppercase font-bold ml-2">Inventory</h2>
        </div>

        {account && displayedAddress && (
          <div className="flex items-center justify-start space-x-2">
            <span
              className="inline-block rounded-full bg-[#202020] px-5 py-2 font-secondary text-base font-bold uppercase text-gray-text hover:cursor-pointer"
              onClick={() => {
                const textarea = document.createElement("textarea");
                textarea.textContent = account;
                textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
                document.body.appendChild(textarea);
                textarea.select();

                try {
                  document.execCommand("copy"); // Security exception may be thrown by some browsers.
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1000);

                  return;
                } catch (ex) {
                  console.warn("Copy to clipboard failed.", ex);
                  return false;
                } finally {
                  document.body.removeChild(textarea);
                }
              }}
            >
              {copied ? (
                <span>
                  <Check />
                </span>
              ) : (
                shortenAddress(displayedAddress)
              )}
            </span>
            <ExternalLink
              className="p-2 text-gray-text flex items-center justify-center rounded-full h-[40px] w-[40px] bg-[#202020]"
              link={etherscanLink}
            />
          </div>
        )}
      </div>

      {/* Double Border Dots */}
      <Image
        src="/double-border-dot.svg"
        alt="logo"
        width={400}
        height={40}
        className="w-full !my-3"
      />

      {approvalTokensCount ? (
        <div className="flex items-start space-x-2 rounded-lg border-0 bg-tb-warning-secondary p-2">
          <div className="h-5 min-h-[20px] w-5 min-w-[20px]">
            <Exclamation />
          </div>
          <p className="text-xs text-tb-warning-primary">
            {`There are existing approvals on (${approvalTokensCount}) tokens owned by this account. Check approval status on tokenbound.org before purchasing.`}
          </p>
        </div>
      ) : null}

      <Tabs
        tabs={Object.values(TABS)}
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
      />

      <TabPanel value={TABS.COLLECTIBLES} currentTab={currentTab}>
        {tokens && tokens.length ? (
          <ul className="custom-scroll grid grid-cols-3 gap-4 overflow-y-auto">
            {tokens.map((t, i) => {
              let media = t?.media[0]?.gateway || t?.media[0]?.raw;
              const isVideo = t?.media[0]?.format === "mp4";
              if (isVideo) {
                media = t?.media[0]?.raw;
              }

              const openseaUrl = `${chainIdToOpenseaAssetUrl[chainId]}/${t.contract.address}/${t.tokenId}`;

              return (
                <li key={`${t.contract.address}-${t.tokenId}-${i}`} className="list-none">
                  <a href={openseaUrl} target="_blank" className="cursor-pointer">
                    <MediaViewer url={media} isVideo={isVideo} />
                  </a>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className={"h-full"}>
            <p className="text-center text-sm text-gray-text">No collectables found</p>
          </div>
        )}
      </TabPanel>

      <TabPanel value={TABS.ASSETS} currentTab={currentTab}>
        <div className="flex w-full flex-col gap-1">
          <div className="flex w-[100%+24px] items-center justify-between py-4 px-6 -mx-6 bg-gray-300 bg-opacity-[0.02]">
            <div className="flex items-center space-x-4">
              <img src="/ethereum-logo.png" alt="ethereum logo" className="h-[40px] w-[40px]" />
              <div className="text-xl font-medium text-white">Ethereum</div>
            </div>
            <div className="text-xl font-bold text-white">
              {ethBalance ? Number(ethBalance).toFixed(2) : "0.00"}
            </div>
          </div>
          {tokenBalanceData?.map((tokenData, i) => (
            <div
              className="flex w-[100%+24px] items-center justify-between py-4 px-6 -mx-6 bg-gray-300 bg-opacity-[0.02]"
              key={i}
            >
              <div className="flex items-center space-x-4">
                {tokenData.logo ? (
                  <img src={tokenData.logo} alt="coin logo" className="h-[40px] w-[40px]" />
                ) : (
                  <div className="text-3xl">💰</div>
                )}
                <div className="text-xl font-medium text-white">{tokenData.name || ""}</div>
              </div>
              <div className="text-xl font-bold text-white">{tokenData.balance}</div>
            </div>
          ))}
        </div>
      </TabPanel>
    </div>
  );
};
