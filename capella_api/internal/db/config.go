package db

import (
	"fmt"
	"time"

	"github.com/couchbase/gocb/v2"
	"github.com/shahfaiz-07/capella_api/internal/config"
)

func ConnectDB(cfg *config.Config) (*gocb.Cluster, *gocb.Collection, error) {
	connectionString := cfg.CPConnectionString
	username := cfg.CPUsername
	password := cfg.CPPassword
	bucketName := cfg.CPBucketName
	scopeName := cfg.CPScopeName
	collectionName := cfg.CPCollection

	clusterOptions := gocb.ClusterOptions{
		Authenticator: gocb.PasswordAuthenticator{
			Username: username,
			Password: password,
		},
	}

	fmt.Println("Connecting to Capella...")
	cluster, err := gocb.Connect(connectionString, clusterOptions)
	if err != nil {
		return nil, nil, err
	}

	// bucket
	fmt.Println("Connection String :", connectionString)
	fmt.Println("Bucket Name :", bucketName)
	bucket := cluster.Bucket(bucketName)

	err = bucket.WaitUntilReady(5*time.Second, nil)

	// collection
	collection := bucket.Scope(scopeName).Collection(collectionName)

	fmt.Println("Connected to Capella ✅")
	return cluster, collection, nil
}
