
import { Question, MBTIDimension } from './types';

const generateOptions = (isOcean: boolean) => [
  { label: "Strongly Agree", value: isOcean ? 5 : 2 },
  { label: "Agree", value: isOcean ? 4 : 1 },
  { label: "Neutral", value: isOcean ? 3 : 0 },
  { label: "Disagree", value: isOcean ? 2 : -1 },
  { label: "Strongly Disagree", value: isOcean ? 1 : -2 }
];

export const MBTI_QUESTIONS: Question[] = [
  // EI: 8 Questions
  { id: 1, text: "You feel energized after spending time with a large group of people.", dimension: MBTIDimension.EI, options: generateOptions(false) },
  { id: 2, text: "You prefer to be the center of attention rather than behind the scenes.", dimension: MBTIDimension.EI, options: generateOptions(false) },
  { id: 3, text: "You tend to think out loud rather than reflecting privately.", dimension: MBTIDimension.EI, options: generateOptions(false) },
  { id: 4, text: "New environments and people make you feel excited and recharged.", dimension: MBTIDimension.EI, options: generateOptions(false) },
  { id: 5, text: "You find it easy to start conversations with strangers at an event.", dimension: MBTIDimension.EI, options: generateOptions(false) },
  { id: 6, text: "You enjoy being at the heart of the action in social gatherings.", dimension: MBTIDimension.EI, options: generateOptions(false) },
  { id: 7, text: "You are often the first to react or speak up in a group situation.", dimension: MBTIDimension.EI, options: generateOptions(false) },
  { id: 8, text: "You communicate with enthusiasm and expressive gestures.", dimension: MBTIDimension.EI, options: generateOptions(false) },
  // SN: 8 Questions
  { id: 9, text: "You are more interested in future possibilities than current realities.", dimension: MBTIDimension.SN, options: generateOptions(false) },
  { id: 10, text: "You often look for deeper, hidden meanings in everyday situations.", dimension: MBTIDimension.SN, options: generateOptions(false) },
  { id: 11, text: "You prefer working with abstract theories over concrete, physical data.", dimension: MBTIDimension.SN, options: generateOptions(false) },
  { id: 12, text: "You find it very easy to spot patterns and trends in information.", dimension: MBTIDimension.SN, options: generateOptions(false) },
  { id: 13, text: "You rely on your 'gut feeling' or intuition more than your physical senses.", dimension: MBTIDimension.SN, options: generateOptions(false) },
  { id: 14, text: "Repetitive, routine work makes you feel bored and restless quickly.", dimension: MBTIDimension.SN, options: generateOptions(false) },
  { id: 15, text: "You value unique innovation more than tried-and-true traditional methods.", dimension: MBTIDimension.SN, options: generateOptions(false) },
  { id: 16, text: "You consider yourself a 'big picture' person rather than detail-oriented.", dimension: MBTIDimension.SN, options: generateOptions(false) },
  // TF: 7 Questions
  { id: 17, text: "You make important decisions based on logic rather than personal values.", dimension: MBTIDimension.TF, options: generateOptions(false) },
  { id: 18, text: "Being efficient and objective is more important than being liked by others.", dimension: MBTIDimension.TF, options: generateOptions(false) },
  { id: 19, text: "You are comfortable with direct confrontation if it leads to a solution.", dimension: MBTIDimension.TF, options: generateOptions(false) },
  { id: 20, text: "Objective truth matters more to you than maintaining social harmony.", dimension: MBTIDimension.TF, options: generateOptions(false) },
  { id: 21, text: "You analyze flaws in an argument quickly and point them out.", dimension: MBTIDimension.TF, options: generateOptions(false) },
  { id: 22, text: "You tend to be skeptical of emotional appeals during a debate.", dimension: MBTIDimension.TF, options: generateOptions(false) },
  { id: 23, text: "Fairness is about applying rules equally to everyone without exception.", dimension: MBTIDimension.TF, options: generateOptions(false) },
  // JP: 7 Questions
  { id: 24, text: "You prefer to have a clear, structured schedule and stick to it.", dimension: MBTIDimension.JP, options: generateOptions(false) },
  { id: 25, text: "You feel uneasy or stressed when tasks are left unfinished or open-ended.", dimension: MBTIDimension.JP, options: generateOptions(false) },
  { id: 26, text: "Meeting deadlines strictly is a very high priority for you.", dimension: MBTIDimension.JP, options: generateOptions(false) },
  { id: 27, text: "You like to plan your vacations and travels in great detail beforehand.", dimension: MBTIDimension.JP, options: generateOptions(false) },
  { id: 28, text: "A tidy and organized workspace is essential for your mental focus.", dimension: MBTIDimension.JP, options: generateOptions(false) },
  { id: 29, text: "You prefer to make a final decision and move on quickly.", dimension: MBTIDimension.JP, options: generateOptions(false) },
  { id: 30, text: "You value organization, structure, and order above flexibility.", dimension: MBTIDimension.JP, options: generateOptions(false) }
];

export const OCEAN_QUESTIONS: Question[] = [
  // Openness: 6
  { id: 101, text: "I have a vivid imagination and often daydream.", trait: 'O', options: generateOptions(true) },
  { id: 102, text: "I enjoy hearing new and unconventional ideas.", trait: 'O', options: generateOptions(true) },
  { id: 103, text: "I am deeply curious about how complex systems work.", trait: 'O', options: generateOptions(true) },
  { id: 104, text: "I am deeply moved by beauty in nature, music, or art.", trait: 'O', options: generateOptions(true) },
  { id: 105, text: "I prefer a life full of variety rather than a fixed routine.", trait: 'O', options: generateOptions(true) },
  { id: 106, text: "I frequently enjoy challenging my own long-held beliefs.", trait: 'O', options: generateOptions(true) },
  // Conscientiousness: 6
  { id: 107, text: "I am always prepared and start my work early.", trait: 'C', options: generateOptions(true) },
  { id: 108, text: "I pay great attention to small details in my tasks.", trait: 'C', options: generateOptions(true) },
  { id: 109, text: "I get my chores and responsibilities done right away.", trait: 'C', options: generateOptions(true) },
  { id: 110, text: "I prefer everything to be in its proper place and tidy.", trait: 'C', options: generateOptions(true) },
  { id: 111, text: "I strictly follow a schedule to manage my time.", trait: 'C', options: generateOptions(true) },
  { id: 112, text: "I am very exacting and thorough in my work standards.", trait: 'C', options: generateOptions(true) },
  // Extraversion: 6
  { id: 113, text: "I am often considered the 'life of the party' by friends.", trait: 'E', options: generateOptions(true) },
  { id: 114, text: "I feel very comfortable and energized around people.", trait: 'E', options: generateOptions(true) },
  { id: 115, text: "I find it easy to start conversations with anyone I meet.", trait: 'E', options: generateOptions(true) },
  { id: 116, text: "I talk to many different people at social events.", trait: 'E', options: generateOptions(true) },
  { id: 117, text: "I truly don't mind being the center of attention.", trait: 'E', options: generateOptions(true) },
  { id: 118, text: "I am skilled at handling various social situations with ease.", trait: 'E', options: generateOptions(true) },
  // Agreeableness: 6
  { id: 119, text: "I am genuinely interested in other people's problems.", trait: 'A', options: generateOptions(true) },
  { id: 120, text: "I sympathize deeply with others' feelings and emotions.", trait: 'A', options: generateOptions(true) },
  { id: 121, text: "I have a 'soft heart' and find it hard to be harsh.", trait: 'A', options: generateOptions(true) },
  { id: 122, text: "I regularly take time out of my day to help others.", trait: 'A', options: generateOptions(true) },
  { id: 123, text: "I excel at making people feel at ease and welcome.", trait: 'A', options: generateOptions(true) },
  { id: 124, text: "I believe in being genuinely kind to everyone I interact with.", trait: 'A', options: generateOptions(true) },
  // Neuroticism: 6
  { id: 125, text: "I get stressed out or overwhelmed quite easily.", trait: 'N', options: generateOptions(true) },
  { id: 126, text: "I worry about small things frequently throughout the day.", trait: 'N', options: generateOptions(true) },
  { id: 127, text: "I am easily disturbed or upset by unexpected events.", trait: 'N', options: generateOptions(true) },
  { id: 128, text: "I get irritated or frustrated quite easily in my daily life.", trait: 'N', options: generateOptions(true) },
  { id: 129, text: "I change my mood or emotional state quite often.", trait: 'N', options: generateOptions(true) },
  { id: 130, text: "I experience frequent and intense mood swings.", trait: 'N', options: generateOptions(true) }
];
