import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchProducts, fetchSellerProducts } from "../store/actions";

const useProductFilter = () => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();

    useEffect(() => {
        const params = new URLSearchParams();

        const currentPage = searchParams.get("page")
            ? Number(searchParams.get("page"))
            : 1;

        params.set("pageNumber", currentPage - 1);

        const sortOrder = searchParams.get("sortby") || "asc";
        const categoryParams = searchParams.get("category") || null;
        const keyword = searchParams.get("keyword") || null;
        params.set("sortBy","price");
        params.set("sortOrder", sortOrder);

        if (categoryParams) {
            params.set("category", categoryParams);
        }

        if (keyword) {
            params.set("keyword", keyword);
        }

        const queryString = params.toString();
        console.log("QUERY STRING", queryString);
        
        dispatch(fetchProducts(queryString));

    }, [dispatch, searchParams]);
    
};

export const useDashboardProductFilter = () => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const hasSellerRoleArray = Array.isArray(user?.roles) && user.roles.some((r) => {
        const role = String(r || '').toUpperCase();
        return role === 'SELLER' || role === 'ROLE_SELLER';
    });
    const singleRole = String(user?.role || '').toUpperCase();
    const hasSellerSingle = singleRole === 'SELLER' || singleRole === 'ROLE_SELLER';
    const isSeller = hasSellerRoleArray || hasSellerSingle;

    useEffect(() => {
        const params = new URLSearchParams();

        const currentPage = searchParams.get("page")
            ? Number(searchParams.get("page"))
            : 1;

        params.set("pageNumber", currentPage - 1);

        const queryString = params.toString();
        if (isSeller) {
            dispatch(fetchSellerProducts(queryString));
        } else {
            // 管理端复用通用的产品列表接口
            dispatch(fetchProducts(queryString));
        }

    }, [dispatch, searchParams, isSeller]);
};

export default useProductFilter;


