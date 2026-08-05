import { ClusterRequest } from "../requests/ClusterRequest";
import { ClusterResult } from "../results/ClusterResult";

export class ClusterGenerator {
  create(request: ClusterRequest): ClusterResult {
    return {
      objects: [
        {
          folder: "clusters",
          name: request.name,

          object: {
            name: request.name,
            server: request.server,
          },
        },
      ],
    };
  }
}
