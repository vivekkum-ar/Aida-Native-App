import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Permission,
  Query,
  Storage,
} from "react-native-appwrite";
import config from "./appwriteConfig";

const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

/* ---------------------------------------------------------------------------------------------- */
/*                                          Register user                                         */
/* ---------------------------------------------------------------------------------------------- */
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) {
      throw Error;
    } else {
      const avatarUrl = avatars.getInitials(username);

      await signIn(email, password);

      const newUser = await databases.createDocument(
        config.databaseId,
        config.userCollectionId,
        ID.unique(),
        {
          accountId: newAccount.$id,
          email: email,
          username: username,
          avatar: avatarUrl,
        }
      );

      return newUser;
    }
  } catch (error) {
    throw new Error(error);
  }
}

/* ---------------------------------------------------------------------------------------------- */
/*                                             Sign In                                            */
/* ---------------------------------------------------------------------------------------------- */
export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

/* ---------------------------------------------------------------------------------------------- */
/*                                      Get the current user                                      */
/* ---------------------------------------------------------------------------------------------- */
export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) {
      throw Error();
    } else {
      const currentUser = await databases.listDocuments(
        config.databaseId,
        config.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );
      if (!currentUser) {
        throw Error;
      } else {
        return currentUser.documents[0];
      }
    }
  } catch (error) {
    // console.log("first");
    throw new Error(error);
  }
};

/* ---------------------------------------------------------------------------------------------- */
/*                                     Get current users post                                     */
/* ---------------------------------------------------------------------------------------------- */
export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId
    );
    // console.log(posts.documents)

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

/* ---------------------------------------------------------------------------------------------- */
/*                                        Get latest posts                                        */
/* ---------------------------------------------------------------------------------------------- */
export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      // [Query.sort("createdAt", "DESC")]
      [Query.limit(7),
      Query.orderDesc("$createdAt")]
    );
    // console.log(posts.documents)
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

/* ---------------------------------------------------------------------------------------------- */
/*                                      Search posts by title                                     */
/* ---------------------------------------------------------------------------------------------- */
export const searchPosts = async (query) => {
  // console.log(query)
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      // [Query.sort("createdAt", "DESC")]
      [Query.search("title", query)]
    );
    // console.log(posts.documents)
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

/* ---------------------------------------------------------------------------------------------- */
/*                                  get user posts from database                                  */
/* ---------------------------------------------------------------------------------------------- */
export const getUserPost = async (userId) => {
  // console.log(userId)
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      // [Query.sort("createdAt", "DESC")]
      [Query.equal("createdByUser", userId)]
    );
    // console.log("id",posts.documents)
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

/* ---------------------------------------------------------------------------------------------- */
/*                                Signout / delete current session                                */
/* ---------------------------------------------------------------------------------------------- */
export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

/* ---------------------------------------------------------------------------------------------- */
/*                                        get file Preview                                        */
/* ---------------------------------------------------------------------------------------------- */
// export async function getFilePreview(fileId, type) {
//   let fileUrl;

//   try {
//     if (type === "video") {
//       fileUrl = storage.getFileView(config.storageId, fileId);
//     } else if (type === "image") {
//       fileUrl = storage.getFilePreview(
//         config.storageId,
//         fileId,
//         2000,
//         2000,
//         "top",
//         100
//       );
//     } else {
//       throw new Error("Invalid file type");
//     }

//     if (!fileUrl) throw Error;

//     return fileUrl;
//   } catch (error) {
//     throw new Error(error);
//   }
// }

/* ---------------------------------------------------------------------------------------------- */
/*                                       upload to appwrite                                       */
/* ---------------------------------------------------------------------------------------------- */
export const uploadFile = async (file,imageBoolean) => {
  if (!file) {
    throw Error("No file selected");
    return;
  }
  const { mimeType,...rest } = file;
  const asset = { name: file.name,
    type: mimeType,
    size: file.size,
    uri: file.uri, };
  // console.log("file",file);
  try {
    const newFile = await storage.createFile(config.storageId,ID.unique(), asset);
    // console.log("uploaded",newFile);
    // const fileUrl = await storage.getFilePreview(newFile.$id,asset.type);
    const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${config.storageId}/files/${newFile.$id}/${imageBoolean ? "preview" : "view"}?project=${config.projectId}`
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};

/* ---------------------------------------------------------------------------------------------- */
/*                             create document in the video collection                            */
/* ---------------------------------------------------------------------------------------------- */
export const createVideo = async (Form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(Form.thumbnail,true),
      uploadFile(Form.video,false),
    ]);
    // const file = await storage.createFile(video.uri);
    // const thumb = await storage.createFile(thumbnail.uri);
    const newPost = await databases.createDocument(
      config.databaseId,
      config.videoCollectionId,
      ID.unique(),
      {
        title: Form.title,
        video: videoUrl,
        thumbnail: thumbnailUrl,
        prompt: Form.prompt,
        users: Form.createdByUser,
        createdByUser: Form.createdByUser,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
};
