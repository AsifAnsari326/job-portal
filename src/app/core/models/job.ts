export interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    type: 'Full-time' | 'Remote' | 'Internship';
    experience : string;
    salary : String;
    tags : string[];
    description : string;
    postedDate : string;
}
