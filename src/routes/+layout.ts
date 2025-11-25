export const prerender = true;

export const load: LayoutServerLoad = async () => {
	return {
		currentDate: new Date().toISOString().split('T')[0]
	};
};
