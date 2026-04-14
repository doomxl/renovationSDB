<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ConfidentController extends AbstractController
{
    #[Route('/politique-de-confidentialite', name: 'app_confident')]
    public function index(): Response
    {
        return $this->render('confident/index.html.twig', [
            'controller_name' => 'ConfidentController',
        ]);
    }
}
