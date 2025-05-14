import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Button } from "@/components/ui/button";
  import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { MouseEventHandler, useEffect, useState } from "react";
import { getGameHistory } from "../services/getGameHistory";
import { getHallOfFame, getLatestHightScore } from "../services/getLatestHightScore";
import  {  useAuthStatus } from "../hooks/checkAuts";
import getUser from "../hooks/getUser";
  
interface ScoreButtonProps {
    text: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
  }

const ScoreButton = ({text, onClick}:ScoreButtonProps)=>(
    <button onClick={onClick} className="bg-secondary text-white text-2xl sm:text-l md:text-xl lg:text-2xl font-orelega px-6 rounded-sm hover:brightness-150">
        {text}
    </button>
)

const Leadboard = () => {
    const [language, setLanguage] = useState("mongolian"); 
    const [scores, setScores] = useState<any>(null);
   // const isLoggedIn = useAuthStatus();
    const { isLoggedIn } = useAuthStatus();
    const [username, setUsername]=useState<any>(null);
    const [activeScoreType, setActiveScoreType] = useState<"myScore" | "latest" | "hall">("latest");
    const [page, setPage] = useState(1);

    const fetchScore = async () =>{
        const data = await getLatestHightScore();
        if(data){
           const mongolianData = data.filter((item: { language: string; })=>item.language==="mongolian");
           const englishData = data.filter(((item: { language: string; })=>item.language==="english"));
           if(language==="mongolian"){
            setActiveScoreType('latest');
            setScores(mongolianData);
            console.log("Mongolian hight score", mongolianData);
           }else{
            setActiveScoreType('latest');
            setScores(englishData);
            console.log("english hight score", englishData);
           }
        }
    }

    const fetchMyScore = async () =>{
        if(isLoggedIn){
            const user = await getUser();
            if(user?.id){
                console.log("MY score", user.id)
                setUsername(user.username);
                const data = await getGameHistory(user.id);
                    const mongolianData = data.filter((item: { language: string; })=>item.language==='mongolian');
                    const englishData = data.filter((item:{language:string;})=>item.language==='english');
                    
                    if(language==='mongolian'){
                        setActiveScoreType('myScore');
                        setScores(mongolianData)
                        console.log("Mongolian data", mongolianData);
                    }else{
                        setActiveScoreType('myScore');
                        setScores(englishData)
                        console.log("english data", englishData)
                    }
            }
        }else{
            setScores(null);
        }
    }
    const fetchHallOfFame = async ()=>{
        const data = await getHallOfFame();
        if(data){
            console.log("Halll", data)
            const mongolianData = data.filter((item: { language: string; })=>item.language==='mongolian');
            const englishData = data.filter((item:{language:string;})=>item.language==='english');
                    
                    if(language==='mongolian'){
                        setActiveScoreType('hall');
                        setScores(mongolianData)
                        console.log("Mongolian data halll", mongolianData);
                    }else{
                        setActiveScoreType('hall');
                        setScores(englishData)
                        console.log("english data halllll", englishData)
                    }
        }

    }
      useEffect(() => {
        if(activeScoreType==='latest'){
            fetchScore();
        }else if(activeScoreType==='myScore'){
            fetchMyScore();
        }else{
            fetchHallOfFame();
        }
      }, [language, isLoggedIn, activeScoreType]);

    const visiblePages = 3;
    const itemsPerPage = 10;
    const totalPages = scores ? Math.ceil(scores.length / itemsPerPage) : 1;

     const currentGroup = Math.floor((page - 1) / visiblePages);

    const startPage = currentGroup * visiblePages + 1;
     const endPage = Math.min(startPage + visiblePages - 1, totalPages);

      const handlePrev = () =>{
        console.log("Button daragdav")
        if(page>1) setPage(page-1)
      }

      const handleNext = () =>{
        if(page<totalPages) setPage(page+1)
            console.log("Button daragdav Daraah")
      }

      const paginatedScores = Array.isArray(scores)
    ? scores.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    : [];  

    return(
        <div className="bg-accent w-2/3 rounded-sm  h-auto mt-16 mb-16 p-10" style={{
            boxShadow: '0 10px 30px rgba(193, 160, 105, 0.7)' 
          }}>
                <div className="flex  justify-center space-x-14">
                    <ScoreButton  text="Latest Hight Score" onClick={()=>{setActiveScoreType('latest'); fetchScore()}} />
                    <ScoreButton text="My score" onClick={()=>{setActiveScoreType('myScore'); fetchMyScore()}}/>
                    <ScoreButton text="Hall of Fame" onClick={()=>{setActiveScoreType('hall'); fetchHallOfFame()}}/>
                </div>
                <div className="mt-4 flex justify-end">
                <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="bg-primary">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-primary">
                        <SelectItem value="mongolian">Mongolian</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                    </SelectContent>
                </Select>
                </div>
            <div className="mt-10  mx-auto overflow-x-auto">
                <Table className="border border-1 border-primary">
                    <TableHeader>
                        <TableRow className="text-xl text-secondary">
                        <TableHead ></TableHead>
                        <TableHead >Name</TableHead>
                        <TableHead >{activeScoreType==="hall" ? "Avg.speed" : "Speed"} </TableHead>
                        <TableHead className="text-right">{activeScoreType==="hall" ? "Races" : "Date"}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.isArray(paginatedScores) && paginatedScores.length>0 ? (
                            paginatedScores.map((score: {
                                totalGames: any;
                                date: string | number | Date; id: any; username: any; speed: any; time: any; })=>(
                                <TableRow key={score.id}>
                                <TableCell className="font-medium">{score.id}</TableCell>
                                <TableCell>{activeScoreType==="myScore" && username ? username : score.username}</TableCell>
                                <TableCell>{parseFloat(score.speed).toFixed(1) }WPM</TableCell>
                                <TableCell className="text-right">
                                        {activeScoreType==='hall' ? score.totalGames :  new Date(score.date).toLocaleDateString('mn-MN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                        </TableCell>
                                </TableRow>
                            ))
                        ) :(
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    {  activeScoreType==="myScore" ? 
                                        "You need an account to see your past scores.":
                                        "No history found."
                                    }
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="mt-4">
                    <Pagination>
                        <PaginationContent>
                        <PaginationItem>
                            <Button variant="ghost" onClick={handlePrev}>
                                 {"<<"}
                            </Button>
                        </PaginationItem>
                         {Array.from({ length: endPage - startPage + 1 }).map((_, idx) => {
                            const pageNum = startPage + idx;
                            return (
                            <PaginationItem key={pageNum}>
                                <PaginationLink
                                isActive={pageNum === page}
                                onClick={() => setPage(pageNum)}
                                >
                                {pageNum}
                                </PaginationLink>
                            </PaginationItem>
                            );
                        })}
                        <PaginationItem>
                            <Button variant="ghost" onClick={handleNext}>
                                 {">>"}
                            </Button>
                        </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    )
}


//position: relative, absolute, ... gpt 
export default Leadboard;