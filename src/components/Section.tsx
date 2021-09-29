
import imgBgHeader from '../assets/bg-header.webp';


const Section =  (props:any) => {
	return <section className={props.className} style={{backgroundImage: `url(${imgBgHeader})`}}>{props.children}</section>;
};
export default Section;