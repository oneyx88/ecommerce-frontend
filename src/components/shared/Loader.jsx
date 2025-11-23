const Loader = ({ text }) => {
    // Remove icon and default "Please wait" text. Only render text if provided.
    if (!text) return null;
    return (
        <div className="flex justify-center items-center w-full h-[80px]">
            <p className="text-slate-800">{text}</p>
        </div>
    );
}

export default Loader;