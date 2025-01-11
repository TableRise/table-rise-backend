const create = 'This route creates and return a campaign';
const update = 'This route updates some campaign info';
const getById = 'This route gets an already created campaign by ID';
const getAll = 'This route returns all campaigns';
const updateMatchImages = 'This route updates the match map images';
const updateMatchMusics = 'This route updates the match musics';
const updateMatchDates = `This route updates the match dates\n
------------------------
Params:
- id: expects the campaign id.\n
Query:
- date: "YYYY-MM-DD" format
- operation: "add" | "remove"`;
const publishment = 'This route publish a post in the campaign';
const addMatchPlayers = 'This route adds player to campaign';
const removeMatchPlayers = 'This route removes player to campaign';
const inviteEmail = 'This route sends a campaign invitation via email';
const updateCampaignImages = 'This route updates the campaign images';

export default {
    create,
    update,
    getById,
    getAll,
    updateMatchImages,
    updateMatchMusics,
    updateMatchDates,
    publishment,
    addMatchPlayers,
    removeMatchPlayers,
    inviteEmail,
    updateCampaignImages,
};
