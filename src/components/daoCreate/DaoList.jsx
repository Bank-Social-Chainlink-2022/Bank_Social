import React,{useState} from "react";\
import {IoCloseSharp} from "react-icons/io"
import {listOfDao} from "../../assets/dummy"

const DaoList = () => {
    const [daoList, setDaoList] = useState([listOfDao]);

  const [search, setSearch] = useState("");


    const searchDao = (e) => {
        let keyword = e.target.value;
    
        if (keyword !== "") {
          const result = daoList.filter((ele) => {
            return ele.name.toLowerCase().startsWith(keyword.toLowerCase());
          });
          setDaoList(result);
        } else {
          setDaoList(daoList);
        }
        setSearch(keyword);
      };


  return (
    <div className="w-[350px] sm:w-[400px] sm:h-[700px] h-[600px] bg-white absolute left-1/2 -translate-x-1/2 -top-16 rounded-3xl text-black">
      <div className="w-[95%] mx-auto mt-3 flex flex-col gap-3 px-2">
        <div className="flex justify-between my-2  font-semibold">
          <p>Select a token</p>
          <button className="text-2xl h-7 pb-5 w-6" onClick={}>
            <IoCloseSharp />
          </button>
        </div>
        <input
          type="search"
          value={search}
          onChange={searchDao}
          placeholder="Search name or past address"
          className="ring-0 border rounded-lg placeholder-gray-800 border-gray-300 text-lg"
        />
        <div className="w-full h-[0.25px] bg-gray-400 mt-3"></div>
        <ul className="overflow-scroll h-[370px] sm:h-[450px] ">
          {daoList && daoList.length > 0 ? (
            daoList.map((key, index) => {
              return (
                <li
                  key={index}
                  className="flex py-2 pl-1 items-center gap-4 hover:bg-slate-200 cursor-pointer"
                  onClick={() => coinSelected(key)}
                >
                  <img
                    className="w-6 h-6 rounded-full object-cover"
                    src={key.nftURI}
                    alt={`${key.title}logo`}
                  />
                  <div className="flex flex-col">
                    <p className="text-xs text-gray-700">{key.title}</p>
                  </div>
                </li>
              );
            })
          ) : (
            <p>No Results</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DaoList;
