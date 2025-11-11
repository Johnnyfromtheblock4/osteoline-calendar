import { createContext, useState, useContext, useEffect } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  // Riferimento alla collezione "events"
  const eventsRef = collection(db, "events");

  // Legge gli eventi in tempo reale da Firestore
  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("date", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const eventList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Eventi ricevuti da Firestore:", eventList); 
        setEvents(eventList);
      },
      (error) => {
        console.error("Errore onSnapshot:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Aggiunge un nuovo evento su Firestore
  const addEvent = async (newEvent) => {
    try {
      if (!newEvent.ownerId) {
        console.error("Errore: ownerId mancante");
        return;
      }

      await addDoc(eventsRef, newEvent);
      console.log("Evento aggiunto su Firestore:", newEvent);
    } catch (error) {
      console.error("Errore durante l'aggiunta dell'evento:", error);
    }
  };

  // Elimina un evento da Firestore
  const removeEvent = async (eventToRemove) => {
    try {
      await deleteDoc(doc(db, "events", eventToRemove.id));
    } catch (error) {
      console.error("Errore durante l'eliminazione dell'evento:", error);
    }
  };

  // Aggiorna un evento esistente
  const updateEvent = async (updatedEvent) => {
    try {
      const ref = doc(db, "events", updatedEvent.id);
      await updateDoc(ref, updatedEvent);
    } catch (error) {
      console.error("Errore durante l'aggiornamento dell'evento:", error);
    }
  };

  // Cancella tutti gli eventi (usato solo dalla RedRoom)
  const clearAllEvents = async () => {
    try {
      const deletePromises = events.map((ev) =>
        deleteDoc(doc(db, "events", ev.id))
      );
      await Promise.all(deletePromises);
      setEvents([]);
    } catch (error) {
      console.error(
        "Errore durante la cancellazione di tutti gli eventi:",
        error
      );
    }
  };

  return (
    <EventContext.Provider
      value={{ events, addEvent, removeEvent, updateEvent, clearAllEvents }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);
