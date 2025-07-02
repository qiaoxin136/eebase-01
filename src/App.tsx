import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";



type MeetingPlaceType = Schema['MeetingPlace']['type']

function App() {
  const { signOut } = useAuthenticator();
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
      date: "2025-10-22",
      time: "09:30",
      track: 1,
      type: "wastewater",
      status: "true",
      lat: 26.0003,
      long: -78.82341,
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
          <li onClick={() => deletePlace(place.id)} key={place.id}>{place.date}{place.lat}{place.long}</li>
        ))}
      </ul>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
