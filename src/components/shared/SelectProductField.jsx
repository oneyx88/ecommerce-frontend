import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { FaCheck } from "react-icons/fa";

const SelectProductField = ({
  label,
  selected,
  setSelected,
  lists = [],
}) => {
  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="flex flex-col gap-2 w-full">
        <label className="font-semibold text-sm text-slate-800">
          {label}
        </label>

        <div className="relative">
          <ListboxButton
            className={`relative text-sm py-2 rounded-md border border-slate-700 w-full cursor-default bg-white text-left text-gray-600 sm:text-sm sm:leading-6`}
          >
            <span className="block truncate ps-2">{selected?.productName || "Select a product"}</span>
          </ListboxButton>
          <ListboxOptions
            transition
            className="absolute z-10 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-opacity-5 ring-black focus:outline-hidden"
          >
            {lists?.map((product) => (
              <ListboxOption
                key={product.productId}
                value={product}
                className="group relative cursor-default py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
              >
                <span className="block truncate font-semibold group-data-[selected]:font-semibold">
                  {product.productName}
                </span>

                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                  <FaCheck className="text-xl" />
                </span>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </div>
    </Listbox>
  );
};

export default SelectProductField;