import { EmoteStatus } from "../api/models";
import { QuerySelectItem } from "../components/QuerySelect";

export const formatDate = (str: string) => {
    const date = new Date(str);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

export const getImageFilePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e: any) => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
};

export const getTagColor = (status: EmoteStatus) => {
    switch (status) {
        case "pending":
            return "orange";
        case "approved":
            return "green";
        case "rejected":
            return "red";
    }
};


export const sortQuerySelectItems: QuerySelectItem[] = [
    { text: "Most Popular", value: "-userCount" },
    { text: "Least Popular", value: "userCount" },
    { text: "Newest First", value: "-createdAt" },
    { text: "Oldest First", value: "createdAt" },
];

export const statusQuerySelectItems: QuerySelectItem[] = [
    { text: "Pending", value: "pending" },
    { text: "Approved", value: "approved" },
    { text: "Rejected", value: "rejected" },
];