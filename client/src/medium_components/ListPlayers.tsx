import axiosConfig from "../configs/AxiosConfigs.ts";
import { useLocation } from "react-router";
import { useState, useEffect } from "react";

const ListPlayers = () => {
  const { state } = useLocation();
  const { lobby } = state;

  interface Players {
    name: string
  }

  const [players, updatePlayers] = useState<Players[]>([]);

  const updatePlayerList = () => {
    axiosConfig
    .get(`/${lobby}/users`)
    .then((res) => {
      updatePlayers(res.data);
    });
  }

  useEffect(() => {
    updatePlayerList();
    const interval = setInterval(updatePlayerList, 333);
    return () => clearInterval(interval);
  });

  return (
    <div className="">
      <h3 className=" text-white mb-4">Participants</h3>
      <ul className=" container-fluid float-none m-auto d-flex">
        {players.map((player, index) => (
          <p
            className="fw-bold font-monospace bg-transparent 
            text-white w-100 float-none m-auto"
            key={index}
          >
            {player.name}
          </p>
        ))}
      </ul>
    </div>
  );
};
export default ListPlayers;
