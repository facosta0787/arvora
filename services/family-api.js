class FamilyApi{
     URL = 'http://localhost/arvora-backend/public/familiares'

    async getPersons(){
        const response = await fetch(this.URL)
        const personas = await response.json()
        return personas
    }
}
let family_api = new FamilyApi()
export default family_api