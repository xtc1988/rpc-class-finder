import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import {
  FileCopy as FileCopyIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { SearchResult } from "@shared/types";

interface ResultCardProps {
  result: SearchResult;
  onCopyPath: (filePath: string) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  onCopyPath,
}) => {
  return (
    <Card sx={{ maxWidth: 800, mx: "auto", mt: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <CheckCircleIcon color="success" />
          <Typography variant="h5" component="h2">
            検索結果
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
            JAVASCRIPT CLASS
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: "monospace", mb: 2 }}>
            {result.jsClass}.js
          </Typography>
          
          <Typography variant="overline" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
            FILE PATH
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Typography variant="body1" sx={{ fontFamily: "monospace", flex: 1 }}>
              {result.filePath}
            </Typography>
            <Chip
              label="ファイル"
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="overline" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
            RPC CLASS
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: "monospace", mb: 2 }}>
            {result.rpcClass}
          </Typography>
          
          <Typography variant="overline" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
            RPC NAME
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: "monospace", mb: 2 }}>
            {result.rpcName}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            variant="outlined"
            startIcon={<FileCopyIcon />}
            onClick={() => onCopyPath(result.filePath)}
          >
            パスをコピー
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
