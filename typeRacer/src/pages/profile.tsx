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
import { useEffect, useState } from "react";
import { getGameHistory } from "../services/getGameHistory";
import  {  useAuthStatus } from "../hooks/checkAuts";
import getUser from "../hooks/getUser";
import LineChartEx from "../components/ui/lineChart";

const UserInfo = ({text1, text2}: {text1:string, text2:string})=>{
        return(
        <div className="bg-primary rounded-sm p-2 flex-1 min-w-1/12 text-center">
            <h1 className="text-xl sm:text-sm md:text-l lg:text-xl">{text1}</h1>
            <p className="text-l sm:text-xs md:text-sm lg:text-l">{text2}</p>
        </div>
    )
}

const Profile = () =>{
    const [language, setLanguage] = useState("mongolian"); 
    const [scores, setScores] = useState<any>(null);
    const [username, setUsername]=useState<any>(null);
  //  const isLoggedIn = useAuthStatus();
  const { isLoggedIn } = useAuthStatus();
  const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchUserAndHistory = async () => {
          const user = await getUser(); 
          setUsername(user?.username);
          console.log("Hereglegch", user);
      
          if (isLoggedIn && user?.id) {
            try {
              const data = await getGameHistory(user.id);
              const mongolianData = data.filter((item: { language: string; })=>item.language==='mongolian');
              const englishData = data.filter((item:{language:string;})=>item.language==='english');
              
              if(language==='mongolian'){
                setScores(mongolianData)
                console.log("Mongolian data", mongolianData);
              }else{
                setScores(englishData)
                console.log("english data", englishData)
              }
             // setScores(data);
              console.log("Harii", data);
            } catch (error) {
              console.error("Тоглоомын түүх авахад алдаа гарлаа", error);
            }
          }
        };
        fetchUserAndHistory();
      }, [isLoggedIn, language]);

      const avgWPm = 
        scores && scores.length > 0
            ? (scores.reduce((acc: number, curr: any) => acc + curr.speed, 0) / scores.length).toFixed(1)
            : "0";

      let bestScore = 0;
        if (scores && scores.length > 0) {
        bestScore = scores[0].speed;
        for (let i = 1; i < scores.length; i++) {
            if (bestScore < scores[i].speed) {
            bestScore = scores[i].speed;
            }
        }
        }

        const getSkillLevel = () => {
        if(scores){
            const avg = parseFloat(avgWPm);
            if(avg <= 20.0) return "Beginner";
            else if(avg<=40) return "Novice";
            else if(avg<=60) return "Intermedia";
            else if(avg<=80) return "Proficient";
            else if(avg<100) return "Advanced";
            else return "Master";
        }
    } 
    const chartData =
    Array.isArray(scores) && scores.length > 0
      ? scores
          .slice() // эх өгөгдлийг хуулах
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // шинэ огноо эхэнд
          .map((score) => ({
            date: new Date(score.date).toLocaleDateString('mn-MN', {
              month: 'short',
              day: 'numeric',
            }),
            value: score.speed,
          }))
      : [];

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
      <div className=" p-16 justify-center">
        <div className="bg-primary flex justify-center" style={{
            boxShadow: '0 10px 30px rgba(200, 200, 255, 0.08)' 
          }}>
            <div className="bg-secondary w-5/6 p-12 rounded-sm space-y-6">
                <h1 className="text-3xl sm:text-l md:text-2xl lg:text-3xl text-primary">{username}</h1>
                <div className="mt-2 flex justify-end">
                    <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="">
                            <div className="text-primary">
                            <SelectValue />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-primary">
                            <SelectItem value="mongolian">Mongolian</SelectItem>
                            <SelectItem value="english">English</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex justify-center space-x-8">
                    <UserInfo text1={`${avgWPm} WPM`} text2="Full Avg"/>
                    <UserInfo text1={`${bestScore} WPM`} text2="Best Race"/>
                    <UserInfo text1={getSkillLevel()} text2="Skill level"/>
                    <UserInfo text1={`${scores?.length || 0}`} text2="Races"/>
                </div>
                <div className="bg-primary p-8 space-y-8 rounded-sm">
                    <h2 className="text-3xl sm:text-l md:text-2xl lg:text-3xl">Your Race Results</h2>
                        <Table className="rounded-4xl border-1 border-gray-900">
                                <TableHeader className="bg-secondary">
                                    <TableRow className="text-xl sm:text-sm md:text-l lg:text-xl text-primary">
                                    <TableHead className="text-primary">Race</TableHead>
                                    <TableHead className="text-primary">Speed</TableHead>
                                    <TableHead className="text-primary">Accuracy</TableHead>
                                    <TableHead className="text-primary">Place</TableHead>
                                    <TableHead className="text-right text-primary">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                {Array.isArray(paginatedScores) && paginatedScores.length > 0 ? (
                                    paginatedScores.map((score, index) => (
                                        <TableRow key={score.id || index}>
                                        <TableCell className="font-medium">{index+1}</TableCell>
                                        <TableCell>{score.speed} WPM</TableCell>
                                        <TableCell>{score.accuracy} %</TableCell>
                                        <TableCell>{score.place}</TableCell>
                                        <TableCell className="text-right">
                                        {new Date(score.date).toLocaleDateString('mn-MN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                        </TableCell>
                                        </TableRow>
                                    ))
                                    ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">Түүх олдсонгүй.</TableCell>
                                    </TableRow>
                                    )}
                                </TableBody>
                        </Table>
                </div>
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
        <div className="w-5/6 mt-6 mx-auto">
          <LineChartEx data={chartData}/>
        </div>
      </div>
    )
}

export default Profile;
