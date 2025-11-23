import { Button, FormControl, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { FiArrowDown, FiArrowUp, FiRefreshCw, FiSearch } from "react-icons/fi";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import clsx from "clsx"; // Optional for conditional class merging

const Filter = ({ categories }) => {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSearchTerm, setTempSearchTerm] = useState("");

  // Initialize state from URL
  useEffect(() => {
    const currentCategory = searchParams.get("category") || "all";
    const currentSortOrder = searchParams.get("sortby") || "asc";
    const currentSearchTerm = searchParams.get("keyword") || "";

    setCategory(currentCategory);
    setSortOrder(currentSortOrder);
    setSearchTerm(currentSearchTerm);
    setTempSearchTerm(currentSearchTerm);
  }, [searchParams]);

  // Update URL when category changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    // Reset to first page when category changes
    params.set("page", "1");
    navigate(`${pathname}?${params.toString()}`, { replace: true });
  }, [category]);

  // Update URL when sortOrder changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    // 不在初始默认值为 asc 时写入 URL（如果本来没有该参数）
    if (sortOrder === "asc" && !params.has("sortby")) {
      return;
    }

    // 用户显式选择了排序：desc 写入；asc 则清理参数
    if (sortOrder === "asc") {
      params.delete("sortby");
    } else {
      params.set("sortby", sortOrder);
    }
    // Reset to first page when sort order changes
    params.set("page", "1");
    navigate(`${pathname}?${params.toString()}`, { replace: true });
  }, [sortOrder]);

  // Trigger search when button clicked or Enter pressed
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (tempSearchTerm) {
      params.set("keyword", tempSearchTerm);
    } else {
      params.delete("keyword");
    }
    // Reset to first page when keyword changes
    params.set("page", "1");
    navigate(`${pathname}?${params.toString()}`, { replace: true });
    setSearchTerm(tempSearchTerm);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex lg:flex-row flex-col-reverse lg:justify-between justify-center items-center gap-4">
      
      {/* SEARCH BAR + BUTTON WITHOUT GAP */}
      <div className="flex items-center 2xl:w-[450px] sm:w-[420px] w-full">
        <input
          type="text"
          placeholder="Search Products"
          value={tempSearchTerm}
          onChange={(e) => setTempSearchTerm(e.target.value)}
          onKeyDown={handleSearchKeyPress}
          className={clsx(
            "border border-gray-400 text-slate-800 rounded-l-md py-2 px-4 w-full",
            "focus:outline-none focus:ring-2 focus:ring-[#1976d2]"
          )}
          style={{ height: "40px" }}
        />
        <button
          onClick={handleSearch}
          className="px-4 bg-[#1976d2] text-white rounded-r-md hover:bg-[#115293] flex items-center justify-center transition-colors"
          style={{ height: "40px" }}
        >
          <FiSearch size={20} />
        </button>
      </div>

      {/* CATEGORY, SORT, CLEAR FILTER OPTIONS */}
      <div className="flex sm:flex-row flex-col gap-4 items-center">
        <FormControl className="text-slate-800 border-slate-700" variant="outlined" size="small">
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
            className="min-w-[120px] text-slate-800 border-slate-700"
          >
            <MenuItem value="all">All</MenuItem>
            {categories.map((item) => (
              <MenuItem key={item.categoryId} value={item.categoryName}>
                {item.categoryName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Tooltip title={`Sort by price: ${sortOrder}`}>
          <Button
            variant="contained"
            onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
            color="primary"
            className="flex items-center gap-2 h-10"
          >
            Sort By
            {sortOrder === "asc" ? <FiArrowUp size={20} /> : <FiArrowDown size={20} />}
          </Button>
        </Tooltip>

        <button
          className="flex items-center gap-2 bg-rose-900 text-white px-3 py-2 rounded-md transition duration-300 ease-in cursor-pointer shadow-md focus:outline-none"
          onClick={() => {
            const params = new URLSearchParams();
            params.set("page", "1");
            navigate(`${pathname}?${params.toString()}`, { replace: true });
          }}
        >
          <FiRefreshCw size={16} />
          <span className="font-semibold">Clear Filter</span>
        </button>
      </div>
    </div>
  );
};

export default Filter;
