import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

type MeetingPlaceType = Schema['MeetingPlace']['type']

function App() {
  const placesClient = generateClient<Schema>().models.MeetingPlace

    const [meetingPlaces, setMeetingPlaces] = useState<Array<MeetingPlaceType>>([])

useEffect(() => {
        placesClient.observeQuery({
            authMode: 'apiKey'
        }).subscribe({
            next: (data) => setMeetingPlaces([...data.items])
        });
    }, []);

    function createPlace() {
        placesClient.create({
            location: window.prompt('Place location')!,
            rating: 5, 
        }, {
            authMode: 'apiKey'
        })
    }


  function deletePlace(id: string) {
    placesClient.delete({ id })
  }

  return (
    <main>
      <button onClick={createPlace}>Create place</button>
        <h3>All places:</h3>
        <ul >
            {meetingPlaces.map((place) => (
                <li  onClick={() => deletePlace(place.id)}key={place.id}>{place.location} + {place.rating}</li>
            ))}
        </ul>
    </main>
  );
}

export default App;
