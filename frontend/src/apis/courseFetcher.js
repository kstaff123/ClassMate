const baseUrl = import.meta.env.VITE_BACKEND_URL;
const apiToken = import.meta.env.VITE_API_TOKEN;


export const fetchCourseList = async () => {
    try {
        const response = await fetch(`${baseUrl}/api/classes?populate=*&populate[class_attributes][populate][attribute][populate]=*&populate[schedules][populate]=*&populate=*&populate[instructors][populate]=*`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${apiToken}`,
                "Content-Type": "application/json",
            }
        });
        if (!response.ok) throw new Error('Failed to fetch course list');
        return response.json();
    } catch (error) {
        console.error("Error fetching course list:", error);
        return null;
    }
};