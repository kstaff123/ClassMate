// In your courseFetcher.js
const baseUrl = import.meta.env.VITE_BACKEND_URL;
const apiToken = import.meta.env.VITE_API_TOKEN;

export const fetchCourseList = async (page = 1, pageSize = 10, filters = {}) => {
  try {
    // Build filter query parameters:
    let filterQuery = "";
    if (filters.searchInput) {
      filterQuery += `&filters[title][$containsi]=${encodeURIComponent(filters.searchInput)}`;
    }
    if (filters.selectedSubject) {
      filterQuery += `&filters[subject][$eq]=${encodeURIComponent(filters.selectedSubject)}`;
    }
    if (filters.selectedGUR) {
      filterQuery += `&filters[class_attributes][attribute][attribute_code][$eq]=${encodeURIComponent(filters.selectedGUR)}`;
    }
    if (filters.selectedDelivery) {
      filterQuery += `&filters[class_attributes][attribute][attribute_code][$eq]=DELIVERY ${encodeURIComponent(filters.selectedDelivery)}`;
    }
    if (filters.selectedInstructor) {
      filterQuery += `&filters[instructors][name][$eq]=${encodeURIComponent(filters.selectedInstructor)}`;
    }
    if (filters.selectedDays) {
      filters.selectedDays.forEach(day => {
        filterQuery += `&filters[schedules][days][${day.key}][$eq]=true`;
      });
    }
    if (filters.selectedStartTime) {
      filterQuery += `&filters[schedules][start_time][$gte]=${encodeURIComponent(filters.selectedStartTime)}`;
    }
    if (filters.selectedEndTime) {
      filterQuery += `&filters[schedules][end_time][$lte]=${encodeURIComponent(filters.selectedEndTime)}`;
    }

    const queryString = [
      `pagination[page]=${page}`,
      `pagination[pageSize]=${pageSize}`,
      `populate=*`,
      `populate[class_attributes][populate][attribute][populate]`,
      `populate[schedules][populate]`,
      `populate[instructors][populate]`,
      filterQuery
    ].join('&');

    console.log("Base URL:", baseUrl);
    console.log("API Token:", apiToken);
    console.log("Generated Query String:", queryString);
    console.log("Full Fetch URL:", `${baseUrl}/api/classes?${queryString}`);

    const response = await fetch(`${baseUrl}/api/classes?${queryString}`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      console.error("Response Status:", response.status);
      console.error("Response Text:", await response.text());
      throw new Error('Failed to fetch course list');
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching course list:", error);
    return null;
  }
};
