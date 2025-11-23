import { TailSpin } from "react-loader-spinner";

const btnStyles = "border-[1.2px] border-slate-800 px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed";

const SetQuantity = ({
    quantity,
    cardCounter,
    onIncrease,
    onDecrease,
    loading,
}) => {
  return (
    <div className="flex gap-8 items-center">
      {cardCounter ? null : <div className="font-semibold">QUANTITY</div>}
      <div className="flex md:flex-row flex-col gap-4 items-center lg:text-[22px] text-sm">
        <button
          disabled={loading}
          className={btnStyles}
          onClick={onDecrease}
          aria-label="decrease quantity"
        >
          -
        </button>

        {loading ? (
          <TailSpin
            visible={true}
            height="24"
            width="24"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
          />
        ) : (
          <div className="text-red-500">{quantity}</div>
        )}

        <button
          disabled={loading}
          className={btnStyles}
          onClick={onIncrease}
          aria-label="increase quantity"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default SetQuantity;