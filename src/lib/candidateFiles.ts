import * as SecureStore from 'expo-secure-store';
import { Directory, File, Paths } from 'expo-file-system';

const documentsDirectory = new Directory(Paths.document, 'candidate-vault');
const photosDirectory = new Directory(Paths.document, 'profile-photos');

export type CandidateDocument = {
  uri: string;
  name: string;
  size: number;
  updatedAt: number | null;
};

function ensureDirectory(directory: Directory) {
  if (!directory.exists) directory.create({ intermediates: true, idempotent: true });
}

function safeName(name: string) {
  return name.trim().replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_') || 'Document';
}

export function listCandidateFolders(parentName?: string) {
  const parent = parentName ? new Directory(documentsDirectory, parentName) : documentsDirectory;
  ensureDirectory(parent);
  return parent.list().filter((entry): entry is Directory => entry instanceof Directory);
}

export function listCandidateDocuments(parentName?: string): CandidateDocument[] {
  const parent = parentName ? new Directory(documentsDirectory, parentName) : documentsDirectory;
  ensureDirectory(parent);
  return parent.list()
    .filter((entry): entry is File => entry instanceof File)
    .map((file) => ({ uri: file.uri, name: file.name, size: file.size, updatedAt: file.lastModified }));
}

export function createCandidateFolder(name: string) {
  const folder = new Directory(documentsDirectory, safeName(name));
  folder.create({ intermediates: true, idempotent: true });
}

export async function saveCandidateDocument(uri: string, name: string, parentName?: string) {
  const parent = parentName ? new Directory(documentsDirectory, parentName) : documentsDirectory;
  ensureDirectory(parent);
  const cleanedName = safeName(name);
  const extension = cleanedName.includes('.') ? cleanedName.slice(cleanedName.lastIndexOf('.')) : '';
  const baseName = extension ? cleanedName.slice(0, -extension.length) : cleanedName;
  let destination = new File(parent, cleanedName);
  if (destination.exists) destination = new File(parent, `${baseName}-${Date.now()}${extension}`);
  await new File(uri).copy(destination);
  return { uri: destination.uri, name: destination.name, size: destination.size, updatedAt: destination.lastModified };
}

export function deleteCandidateDocument(uri: string) {
  new File(uri).delete();
}

export function getCandidatePhoto(userId: number) {
  return SecureStore.getItemAsync(`candidate-photo-${userId}`);
}

export async function saveCandidatePhoto(userId: number, uri: string) {
  ensureDirectory(photosDirectory);
  const source = new File(uri);
  const extension = source.extension || '.jpg';
  const destination = new File(photosDirectory, `candidate-${userId}${extension}`);
  if (destination.exists) destination.delete();
  await source.copy(destination);
  await SecureStore.setItemAsync(`candidate-photo-${userId}`, destination.uri);
  return destination.uri;
}