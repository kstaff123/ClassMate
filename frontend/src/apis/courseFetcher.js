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
      filterQuery += `&filters[class_attributes][attribute][attribute_code][$eq]=${encodeURIComponent(filters.selectedDelivery)}`;
    }
    if (filters.selectedInstructor) {
      filterQuery += `&filters[instructors][name][$eq]=${encodeURIComponent(filters.selectedInstructor)}`;
    }
    if (filters.selectedDays && filters.selectedDays.length > 0) {
      filters.selectedDays.forEach((day, index) => {
        filterQuery += `&filters[schedules][$and][${index}][days][${day.key}][$eq]=true`;
      });
    }
    
    
    if (filters.selectedStartTime) {
      filterQuery += `&filters[schedules][start_time][$gte]=${encodeURIComponent(filters.selectedStartTime)}`;
    }
    if (filters.selectedEndTime) {
      filterQuery += `&filters[schedules][end_time][$lte]=${encodeURIComponent(filters.selectedEndTime)}`;
    }

    console.log("Filters applied:", filters);
    console.log("Constructed filter query:", filterQuery);

    const queryString = [
      `pagination[page]=${page}`,
      `pagination[pageSize]=${pageSize}`,
      `populate=*`,
      `populate[class_attributes][populate][attribute][populate][class_attributes][populate]=*`,
      `populate[schedules][populate]=*`,
      `populate[instructors][populate]=*`,
      filterQuery
    ].join('&');

    console.log("Final query string:", queryString);
    console.log("Final URL:", `${baseUrl}/api/classes?${queryString}`);

    const response = await fetch(`${baseUrl}/api/classes?${queryString}`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) throw new Error('Failed to fetch course list');

    const jsonResponse = await response.json();
    console.log("Fetched course list:", jsonResponse);

    return jsonResponse;
  } catch (error) {
    console.error("Error fetching course list:", error);
    return null;
  }
};