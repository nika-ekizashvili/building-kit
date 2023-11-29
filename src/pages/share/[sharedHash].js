import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingPage from "../../components/ui/LoadingPage";
import Project from "../../components/projects/Project";

const SharedProjectPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [project, setProject] = useState(null);

    const isLoggedIn = useSelector((state) => state.auth.loggedIn);
    const status = useSelector((state) => state.userStatus)

    const [suppliers, setSuppliers] = useState(null);
    const [unit, setUnit] = useState(null);
    const [crafts, setCrafts] = useState(null);
    const [craftStatus, setCraftStatus] = useState(null);
    const [productStatus, setProductStatus] = useState(null);
    const [projectCategory, setProjectCategory] = useState(null);
    const [productOptions, setProductOptions] = useState(null);
    const [editProductItem, setEditProductItem] = useState(null);
    const [defaultImage, setDefaultImage] = useState(null);

    const [projectIdR, setProjectIdR] = useState(null);
    const [projectType, setProjectType] = useState(null);

    const pathname = window.location.pathname;
    const lastSlashIndex = pathname.lastIndexOf('/');
    const hashedId = pathname.substring(lastSlashIndex + 1);
    
    const getProjectById = async () => {
        if (hashedId) {
            try {
                const id_response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/shared-projects?populate=projects&filters[hash][$eq]=${hashedId}`
                );
                const project_id = id_response.data?.data[0]?.attributes?.projects?.data[0]?.id;
                setProjectType(id_response.data?.data[0]?.attributes?.projects?.data[0]?.attributes?.project_type)
                setProjectIdR(project_id)
                if (project_id) {
                    try {
                        const projectRes = await axios.get(
                            `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/projects?populate=*&filters[id][$eq]=${project_id}`
                        );
                        const projectData = projectRes.data?.data;
                        setProject(projectData);
                        if (projectType === 'repair') {
                            const productRes = await axios.get(
                                `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/projects?populate=products.categories&filters[id][$eq]=${project_id}`
                            );
                            const productData = productRes.data;
                            setProductOptions(productData);
                            const categoryRes = await axios.get(
                                `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/categories?populate=*&filters[projects][id][$eq]=${project_id}`
                            );
                            const categoryData = categoryRes.data.data;
                            setProjectCategory(categoryData);

                            setIsLoading(false);
                        } else {
                            const productRes = await axios.get(
                                `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/projects?populate=products.category-builds&filters[id][$eq]=${project_id}`
                            );
                            const productData = productRes.data;
                            setProductOptions(productData);
                            const categoryRes = await axios.get(
                                `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/category-builds?populate=*&filters[projects][id][$eq]=${project_id}`
                            );
                            const categoryData = categoryRes.data.data;
                            setProjectCategory(categoryData);

                            setIsLoading(false);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
    useEffect(() => {
        getProjectById();
    }, [hashedId]);

    useEffect(() => {
        const getSupplierHandler = async () => {
            await axios
                .get(`${process.env.NEXT_PUBLIC_BUILDING_URL}/api/suppliers`)
                .then((res) => {
                    const data = res.data;
                    setSuppliers(data.data);
                });
        };

        const getUnitHandler = async () => {
            await axios
                .get(`${process.env.NEXT_PUBLIC_BUILDING_URL}/api/units`)
                .then((res) => {
                    const data = res.data;
                    setUnit(data.data);
                });
        };

        const getCraftsHandler = async () => {
            await axios
                .get(
                    `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/crafts?populate=image,categories`
                )
                .then((res) => {
                    const data = res.data;
                    setCrafts(data.data);
                });
        };

        const getCraftsStatusHandler = async () => {
            await axios
                .get(`${process.env.NEXT_PUBLIC_BUILDING_URL}/api/craft-statuses`)
                .then((res) => {
                    const data = res.data;
                    setCraftStatus(data.data);
                });
        };

        const getProductsStatusHandler = async () => {
            await axios
                .get(`${process.env.NEXT_PUBLIC_BUILDING_URL}/api/product-statuses`)

                .then((res) => {
                    const data = res.data;
                    setProductStatus(data.data);
                });
        };

        const getDefaultImage = async () => {
            await axios
                .get(
                    `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/default-image?populate=NoImage`
                )

                .then((res) => {
                    const data = res.data;
                    setDefaultImage(
                        data.data?.attributes?.NoImage?.data?.attributes?.url
                    );
                });
        };

        getDefaultImage();
        getProductsStatusHandler();
        getCraftsStatusHandler();
        getCraftsHandler();
        getSupplierHandler();
        getUnitHandler();
    }, []);

    if (isLoading) {
        return <LoadingPage />;
    }

    if (!project) {
        return <p>Project not found.</p>;
    }

    return (
        <Project
            projectIdR={projectIdR}
            readOnly={true}
            // hashedUrl={hashedUrl}
            isLoggedIn={isLoggedIn}
            allowedExport={status.allowed_export}
            productStatus={productStatus}
            productOptions={productOptions}
            project={project}
            craftStatus={craftStatus}
            crafts={crafts}
            suppliers={suppliers}
            unit={unit}
            projectCategory={projectCategory}
            // editHandler={editHandler}
            editProductItem={editProductItem}
            defaultImage={defaultImage}
            getProjectById={getProjectById}
        />
    );
};

export default SharedProjectPage;