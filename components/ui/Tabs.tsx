interface Props
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement> {
  tabs: string[];
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Tabs = ({ tabs, currentTab, onTabChange, ...props }: Props) => {
  return (
    <ul className="flex items-center justify-start pt-5 bg-gray-300 bg-opacity-[0.02]" {...props}>
      {tabs.map((tab) => {
        return (
          <li
            className={`relative list-none w-full text-lg text-center font-secondary font-bold uppercase hover:cursor-pointer pb-5 ${
              currentTab === tab ? "text-white" : "text-gray-text"
            }`}
            key={tab}
            onClick={() => onTabChange(tab)}
          >
            {currentTab === tab && (
              <div className="bg-white w-full h-1 rounded-t-md absolute bottom-0" />
            )}

            {tab}
          </li>
        );
      })}
    </ul>
  );
};
